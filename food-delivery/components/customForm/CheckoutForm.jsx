import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useUser } from "@auth0/nextjs-auth0";
import { ordersSlice } from "../../slices/ordersSlice";
import { store } from "../../store";
import userApi from "../../pages/api/userApi";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const {user} = useUser()

  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent }) => {
    switch (paymentIntent.status) {
        case "succeeded":
          console.log(paymentIntent)
          alert("payment is success")
          setMessage("Payment succeeded!");
          if(user.sub){
            const actionDeleteAll =
                                ordersSlice.actions.deleteAll();
                              store.dispatch(actionDeleteAll);
                              await userApi.removeOrder(
                                store.getState().order.current,
                                user.sub
                              );
                              await userApi.backupOrder(user.sub, store.getState().order.current);
          }
          break;
        case "processing":
          console.log(paymentIntent.status)
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          console.log(paymentIntent.status)
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          console.log(paymentIntent.status)
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "https://fooddelivery-livid.vercel.app/user/cart",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}