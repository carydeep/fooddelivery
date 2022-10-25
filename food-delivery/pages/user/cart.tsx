import { useUser } from "@auth0/nextjs-auth0";
import {
  Field,
  FieldAttributes,
  FieldInputProps,
  FieldProps,
  Form,
  Formik,
} from "formik";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useAppSelector } from "../../hooks";
import LayoutUser from "../../layouts/layoutUser";
import { getFoods } from "../../slices/foodSlice";
import { getOrders, ordersSlice } from "../../slices/ordersSlice";
import { store } from "../../store";
import styles from "../../styles/Cart.module.scss";
import userApi from "../api/userApi";
import * as Yup from "yup";
import OrderBox from "../../components/popUp/orderBox";
import Head from "next/head";
import { PayPalButtons } from "@paypal/react-paypal-js";
import GooglePayButton from "@google-pay/button-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/customForm/CheckoutForm";
import billApi from "../api/billApi";

export interface Payment {
  paymentMethod: string;
  name: string;
  cardNumber: string;
  expireDate: string;
  cvv: string;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

function Cart() {
  const [dateNow, setDateNow] = useState<string>("");
  const orders = useAppSelector((state) => state.order.current);
  const foods = useAppSelector((state) => state.food.current);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [payment, setPayment] = useState<Payment>({
    paymentMethod: "visa",
    name: "",
    cardNumber: "",
    expireDate: "",
    cvv: "",
  });
  const { user } = useUser();
  const handleChangeShowPopUpOrder = useCallback(() => {
    setShowPopUp(!showPopUp);
  }, [showPopUp]);
  const initialValue = {
    paymentMethod: "visa",
    name: "",
    cardNumber: "",
    expireDate: "",
    cvv: "",
  };
  const validateSchema = Yup.object().shape({
    paymentMethod: Yup.string().required(),
    name: Yup.string().required("This field is required"),
    cardNumber: Yup.string()
      .length(19, "You need to type valid card number")
      .required("This field is require"),
    expireDate: Yup.string().required("This field is required"),
    cvv: Yup.string()
      .required("This field is required")
      .length(3, "You must type correct cvv"),
  });

  useEffect(() => {
    const updateFood = async () => {
      await store.dispatch(getFoods());
    };
    const getDateNow = () => {
      const today = new Date();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      setDateNow(`${yyyy}-${mm}`);
    };
    getDateNow();
    updateFood();
  }, []);

  const cardNumberFormat = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const cardCvvFormat = (value: string) => {
    return value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  };

  const handleAddOrders = async (idFood: number) => {
    const foodInfo = foods.find((food) => food.id === idFood);
    if (foodInfo && user?.sub) {
      const actionAddOrder = ordersSlice.actions.add(foodInfo);
      store.dispatch(actionAddOrder);
      try {
        await userApi.addOrder(store.getState().order.current, user.sub);
        await userApi.backupOrder(user.sub, store.getState().order.current);
      } catch (error) {
        console.log("error:" + error);
      }
    }
  };

  const handleRemoveOrder = async (idFood: number) => {
    const food = foods.find((food) => food.id === idFood);
    if (food && user?.sub) {
      const actionRemoveOrder = ordersSlice.actions.remove(food);
      store.dispatch(actionRemoveOrder);
      try {
        await userApi.removeOrder(store.getState().order.current, user.sub);
        await userApi.backupOrder(user.sub, store.getState().order.current);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDelete = async (idFood: number) => {
    const food = foods.find((food) => food.id === idFood);
    if (food && user?.sub) {
      const actionDeleteOrder = ordersSlice.actions.delete(food);
      store.dispatch(actionDeleteOrder);
      try {
        await userApi.removeOrder(store.getState().order.current, user.sub);
        await userApi.backupOrder(user.sub, store.getState().order.current);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //copy from stripe dev
  const [clientSecret, setClientSecret] = React.useState("");

  React.useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    if (orders?.totalAmount) {
      fetch("../api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: orders?.totalAmount }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        });
    }
  }, [orders]);

  const appearance = {
    theme: "stripe" as const,
  };
  const options = {
    clientSecret,
    appearance,
  };
  return (
    <>
      <div className={styles.container}>
        {showPopUp && (
          <OrderBox
            showPopUp={showPopUp}
            onShow={handleChangeShowPopUpOrder}
            orderConfirm={payment}
          ></OrderBox>
        )}
        <div className={styles.shoppingCart}>
          <p className={styles.shoppingCart__title}>Shopping Cart</p>
          <ul className={styles.shoppingCart__list}>
            {orders &&
              orders.orderItems &&
              orders.orderItems.map((order) => {
                return (
                  <li className={styles.shoppingCart__item} key={order.id}>
                    <img
                      className={styles.shoppingCart__item__img}
                      src={order.img}
                    />
                    <div className={styles.shoppingCart__item__info}>
                      <p className={styles.shoppingCart__item__info__name}>
                        {order.name}
                      </p>
                      <div className={styles.shoppingCart__item__info__weight}>
                        {"290g"}
                      </div>
                    </div>
                    <div className={styles.shoppingCart__item__quatity}>
                      <button
                        onClick={() => handleAddOrders(order.id)}
                        className={styles.shoppingCart__item__quatity__button}
                      >
                        <BsPlusLg />
                      </button>
                      <p className={styles.shoppingCart__item__quatity__number}>
                        {order.quantity}
                      </p>
                      <button
                        onClick={() => handleRemoveOrder(order.id)}
                        className={styles.shoppingCart__item__quatity__button}
                      >
                        <FaMinus />
                      </button>
                    </div>
                    <h3 className={styles.shoppingCart__item__price}>
                      ${order.price}
                    </h3>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className={styles.shoppingCart__item__remove}
                    >
                      <MdClose />
                    </button>
                  </li>
                );
              })}
          </ul>
          <div className={styles.shoppingCart__code}>
            <form className={styles.shoppingCart__code__form}>
              <label htmlFor="code">Promote code: </label>
              <input
                className={styles.shoppingCart__code__form__input}
                type="text"
                pattern="\d*"
                maxLength={6}
                id="code"
                placeholder="XXXXXX"
              />
            </form>
            <div className={styles.shoppingCart__code__total}>
              <div className={styles.shoppingCart__code__total__label}>
                To pay:
              </div>
              <div className={styles.shoppingCart__code__total__number}>
                <p className={styles.unit}>$</p>
                {orders?.totalAmount}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.cardDetails}>
          <p className={styles.title}>Card Details</p>
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
          <Formik
            initialValues={initialValue}
            validationSchema={validateSchema}
            onSubmit={(value) => {
              setShowPopUp(true);
              setPayment(value);
            }}
          >
            {(formikProps) => {
              const { values, errors } = formikProps;
              values.cardNumber = cardNumberFormat(values.cardNumber);
              values.cvv = cardCvvFormat(values.cvv);

              return (
                <Form className={styles.form}>
                  <div className={styles.label} id="paymentMethod">
                    Payment method
                  </div>
                  {orders?.totalAmount && (
                    <PayPalButtons
                      style={{ layout: "horizontal" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                currency_code: "USD",
                                value: `${orders.totalAmount}`,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions: any) => {
                        return actions.order
                          .capture()
                          .then(async (details: any) => {
                            if (user?.sub) {
                              const name = details.payer.name.given_name;
                              const price =
                                details.purchase_units[0].amount.value;
                              alert(`Transaction completed by ${name}`);
                              const actionDeleteAll =
                                ordersSlice.actions.deleteAll();
                              store.dispatch(actionDeleteAll);
                              await userApi.removeOrder(
                                store.getState().order.current,
                                user.sub
                              );
                              await billApi.createBill(
                                user.sub,
                                name,
                                price,
                                "paypal",
                                store.getState().order.current
                              );
                              await userApi.backupOrder(
                                user.sub,
                                store.getState().order.current
                              );
                            }
                          });
                      }}
                    ></PayPalButtons>
                  )}
                  {orders?.totalAmount && (
                    <GooglePayButton
                      buttonColor="white"
                      environment="TEST"
                      paymentRequest={{
                        apiVersion: 2,
                        apiVersionMinor: 0,
                        allowedPaymentMethods: [
                          {
                            type: "CARD",
                            parameters: {
                              allowedAuthMethods: [
                                "PAN_ONLY",
                                "CRYPTOGRAM_3DS",
                              ],
                              allowedCardNetworks: ["MASTERCARD", "VISA"],
                            },
                            tokenizationSpecification: {
                              type: "PAYMENT_GATEWAY",
                              parameters: {
                                gateway: "example",
                                gatewayMerchantId: "exampleGatewayMerchantId",
                              },
                            },
                          },
                        ],
                        merchantInfo: {
                          merchantId: "12345678901234567890",
                          merchantName: "Demo Merchant",
                        },
                        transactionInfo: {
                          totalPriceStatus: "FINAL",
                          totalPriceLabel: "Total",
                          totalPrice: `${orders.totalAmount}`,
                          currencyCode: "USD",
                          countryCode: "US",
                        },
                        shippingAddressRequired: true,
                      }}
                      onLoadPaymentData={async (paymentRequest: any) => {
                        console.log("load payment data", paymentRequest);
                        if (user?.sub) {
                          alert(`Transaction completed`);
                          const actionDeleteAll =
                            ordersSlice.actions.deleteAll();
                          store.dispatch(actionDeleteAll);
                          await userApi.removeOrder(
                            store.getState().order.current,
                            user.sub
                          );
                          await userApi.backupOrder(
                            user.sub,
                            store.getState().order.current
                          );
                          await billApi.createBill(
                            user.sub,
                            user.name as string,
                            orders.totalAmount,
                            "googlepay",
                            store.getState().order.current
                          );
                        }
                      }}
                    />
                  )}
                  <div
                    className={styles.group__radio}
                    role="group"
                    aria-labelledby="paymentMethod"
                  >
                    <label
                      className={`${styles.radioMethod} ${
                        values.paymentMethod === "visa" && styles.active
                      }`}
                    >
                      <Field
                        className={styles.group__radio__input}
                        type="radio"
                        name="paymentMethod"
                        value="visa"
                      />
                      <img
                        className={styles.radioMethod__img}
                        src="../visaImage.png"
                      />
                    </label>
                    <label
                      className={`${styles.radioMethod} ${
                        values.paymentMethod === "mastercard" && styles.active
                      }`}
                    >
                      <Field
                        className={styles.group__radio__input}
                        type="radio"
                        name="paymentMethod"
                        value="mastercard"
                      />
                      <img
                        className={styles.radioMethod__img}
                        src="../mastercardImage.png"
                      />
                    </label>
                  </div>
                  <label className={styles.label} htmlFor="name">
                    Name and Surname
                  </label>
                  <Field
                    className={styles.inputText}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <span className={styles.error}>{errors.name}</span>
                  )}
                  <label className={styles.label} htmlFor="ccn">
                    Card Number
                  </label>
                  <Field
                    className={styles.inputText}
                    name="cardNumber"
                    type="text"
                    placeholder="XXXX XXXX XXXX XXXX"
                  />
                  {errors.cardNumber && (
                    <span className={styles.error}>{errors.cardNumber}</span>
                  )}
                  <div className={styles.valid}>
                    <div className={styles.valid__date}>
                      <div className={styles.label}>Expiration Date</div>
                      <div className={styles.valid__date__input}>
                        <Field
                          className={`${styles.inputText} ${styles.date}`}
                          type="month"
                          name="expireDate"
                          min={dateNow}
                        />
                        {errors.expireDate && (
                          <span className={styles.error}>
                            {errors.expireDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles.valid__cvv}>
                      <label className={styles.label} htmlFor="cvv">
                        CVV
                      </label>
                      <Field
                        className={styles.inputText}
                        type="text"
                        name="cvv"
                        id="cvv"
                        maxLength={3}
                        placeholder="XXX"
                      />
                      {errors.cvv && (
                        <span className={styles.error}>{errors.cvv}</span>
                      )}
                    </div>
                  </div>
                  <button type="submit" className={styles.button}>
                    Check Out
                  </button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
}

Cart.getLayout = function getLayout(page: ReactElement) {
  return <LayoutUser>{page}</LayoutUser>;
};

export default Cart;
