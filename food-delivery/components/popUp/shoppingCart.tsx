import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import React, { memo, useEffect, useRef, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useAppSelector } from "../../hooks";
import { OrderUser } from "../../models";
import axiosUser from "../../pages/api/axiosUser";
import userApi from "../../pages/api/userApi";
import { ordersSlice } from "../../slices/ordersSlice";
import { store } from "../../store";
import styles from "../../styles/PopUpShoppingCart.module.scss";

interface Props {
  orders?: OrderUser;
  showPopUp: boolean;
  onShow: Function;
  addOrder: Function;
}

function PopUpShoppingCart(props: Props) {
  const { showPopUp, orders, onShow, addOrder } = props;
  const ref = useRef<HTMLDivElement>(null);
  const foods = useAppSelector((state) => state.food.current);
  const { user } = useUser();

  useEffect(() => {
    const checkClickOutSidePopUp = (e: any) => {
      if (showPopUp && ref.current && !ref.current.contains(e.target)) {
        onShow();
      }
    };

    document.addEventListener("click", checkClickOutSidePopUp);

    return () => {
      document.removeEventListener("click", checkClickOutSidePopUp);
    };
  }, [showPopUp]);

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

  return (
    <div className={styles.container}>
      <div ref={ref} className={styles.container__wrapper}>
        <button className={styles.close} onClick={() => onShow()}>
          <MdClose />
        </button>
        <div className={styles.name}>My Order</div>
        <div className={styles.listOrder}>
          {orders &&
            orders.orderItems.map((order) => {
              return (
                <div key={order.id} className={styles.listOrder__item}>
                  <img
                    className={styles.listOrder__item__img}
                    src={order.img}
                  />
                  <div className={styles.listOrder__item__info}>
                    <div className={styles.listOrder__item__info__left}>
                      <div className={styles.listOrder__item__info__left__name}>
                        {order.name}
                      </div>
                      <div
                        className={styles.listOrder__item__info__left__adjust}
                      >
                        <button
                          onClick={() => {
                            addOrder(order.id);
                          }}
                          className={
                            styles.listOrder__item__info__left__adjust__button
                          }
                        >
                          <BsPlusLg />
                        </button>
                        <div
                          className={
                            styles.listOrder__item__info__left__adjust__quantity
                          }
                        >
                          {order.quantity}
                        </div>
                        <button
                          onClick={() => {
                            handleRemoveOrder(order.id);
                          }}
                          className={
                            styles.listOrder__item__info__left__adjust__button
                          }
                        >
                          <FaMinus />
                        </button>
                      </div>
                    </div>
                    <div className={styles.listOrder__item__info__right}>
                      {order.price}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <Link href={`/user/cart`}>
          <a className={styles.toShopping}>To Shopping Cart</a>
        </Link>
      </div>
    </div>
  );
}

export default memo(PopUpShoppingCart);
