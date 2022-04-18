import React, { memo, useEffect, useRef, useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { FaMinus } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { OrderUser } from '../../models';
import styles from '../../styles/PopUpShoppingCart.module.scss'

interface Props {
    orders?: OrderUser,
    showPopUp: boolean,
    onShow: Function,
    addOrder: Function
}

function PopUpShoppingCart(props: Props) {
    const { showPopUp, orders, onShow, addOrder } = props;
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const checkClickOutSidePopUp = (e: any) => {
            if (showPopUp && ref.current && !ref.current.contains(e.target)) {
                onShow()
            }
        }

        document.addEventListener("click", checkClickOutSidePopUp)

        return () => {
            document.removeEventListener("click", checkClickOutSidePopUp)
        }
    }, [showPopUp])


    return (
        <div className={styles.container}>
            <div ref={ref} className={styles.container__wrapper}>
                <button className={styles.close} onClick={() => onShow()}><MdClose /></button>
                <div className={styles.name}>My Order</div>
                <div className={styles.listOrder}>
                    {orders && orders.orderItems.map(order => {
                        return (
                            <div key={order.id} className={styles.listOrder__item}>
                                <img className={styles.listOrder__item__img} src={order.img} />
                                <div className={styles.listOrder__item__info}>
                                    <div className={styles.listOrder__item__info__left}>
                                        <div className={styles.listOrder__item__info__left__name}>{order.name}</div>
                                        <div className={styles.listOrder__item__info__left__adjust}>
                                            <button onClick={() => { addOrder(order.id) }} className={styles.listOrder__item__info__left__adjust__button}><BsPlusLg /></button>
                                            <div className={styles.listOrder__item__info__left__adjust__quantity}>{order.quantity}</div>
                                            <button className={styles.listOrder__item__info__left__adjust__button}><FaMinus /></button>
                                        </div>
                                    </div>
                                    <div className={styles.listOrder__item__info__right}>{order.price}</div>
                                </div>
                            </div>
                        )
                    })
                    }
                    {/* <div className={styles.listOrder__item}>
                        <img className={styles.listOrder__item__img} src="AllFood.png" />
                        <div className={styles.listOrder__item__info}>
                            <div className={styles.listOrder__item__info__left}>
                                <div className={styles.listOrder__item__info__left__name}>Test</div>
                                <div className={styles.listOrder__item__info__left__adjust}>
                                    <button className={styles.listOrder__item__info__left__adjust__button}><BsPlusLg /></button>
                                    <div className={styles.listOrder__item__info__left__adjust__quantity}>1</div>
                                    <button className={styles.listOrder__item__info__left__adjust__button}><FaMinus /></button>
                                </div>
                            </div>
                            <div className={styles.listOrder__item__info__right}>$48</div>
                        </div>
                    </div> */}
                </div>
                <button className={styles.toShopping}>
                    To Shopping Cart
                </button>
            </div>
        </div>
    );
}

export default memo(PopUpShoppingCart);