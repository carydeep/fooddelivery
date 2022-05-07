import { useUser } from '@auth0/nextjs-auth0';
import { Field, Form, Formik } from 'formik';
import React, { ReactElement, useEffect } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { FaMinus } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { useAppSelector } from '../../hooks';
import LayoutUser from '../../layouts/layoutUser';
import { getFoods } from '../../slices/foodSlice';
import { getOrders, ordersSlice } from '../../slices/ordersSlice';
import { store } from '../../store';
import styles from '../../styles/Cart.module.scss'
import userApi from '../api/userApi';

function Cart() {
    const orders = useAppSelector(state => state.order.current)
    const foods = useAppSelector(state => state.food.current)
    const { user } = useUser()
    const initialValue = {
        paymentMethod: '',
        name: '',
        cardNumber: null,
        month: null,
        year: null,
        cvv: null
    }

    useEffect(() => {
        const updateFood = async () => {
            await store.dispatch(getFoods())
        }
        updateFood()
    }, [])
    useEffect(() => {
        const updateOrder = async () => {
            if (user?.sub) {
                await store.dispatch(getOrders(user.sub))
            }
        }
        updateOrder()
    }, [user])

    const handleAddOrders = async (idFood: number) => {
        const foodInfo = foods.find(food => food.id === idFood)
        if (foodInfo && user?.sub) {
            const actionAddOrder = ordersSlice.actions.add(foodInfo)
            store.dispatch(actionAddOrder)
            try {
                await userApi.addOrder(store.getState().order.current, user.sub)
            } catch (error) {
                console.log('error:' + error)
            }
        }
    }

    const handleRemoveOrder = async (idFood: number) => {
        const food = foods.find(food => food.id === idFood)
        if (food && user?.sub) {
            const actionRemoveOrder = ordersSlice.actions.remove(food)
            store.dispatch(actionRemoveOrder)
            try {
                await userApi.removeOrder(store.getState().order.current, user.sub)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleDelete = async (idFood: number) => {
        const food = foods.find(food => food.id === idFood)
        if (food && user?.sub) {
            const actionDeleteOrder = ordersSlice.actions.delete(food)
            store.dispatch(actionDeleteOrder)
            try {
                await userApi.removeOrder(store.getState().order.current, user.sub)
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.shoppingCart}>
                <p className={styles.shoppingCart__title}>Shopping Cart</p>
                <ul className={styles.shoppingCart__list}>
                    {orders && orders.orderItems.map(order => {
                        return (
                            <li className={styles.shoppingCart__item} key={order.id}>
                                <img className={styles.shoppingCart__item__img} src={order.img} />
                                <div className={styles.shoppingCart__item__info}>
                                    <p className={styles.shoppingCart__item__info__name}>{order.name}</p>
                                    <div className={styles.shoppingCart__item__info__weight}>{'290g'}</div>
                                </div>
                                <div className={styles.shoppingCart__item__quatity}>
                                    <button onClick={() => handleAddOrders(order.id)} className={styles.shoppingCart__item__quatity__button}><BsPlusLg /></button>
                                    <p className={styles.shoppingCart__item__quatity__number}>{order.quantity}</p>
                                    <button onClick={() => handleRemoveOrder(order.id)} className={styles.shoppingCart__item__quatity__button}><FaMinus /></button>
                                </div>
                                <h3 className={styles.shoppingCart__item__price}>${order.price}</h3>
                                <button onClick={() => handleDelete(order.id)} className={styles.shoppingCart__item__remove}><MdClose /></button>
                            </li>
                        )
                    })}
                </ul>
                <div className={styles.shoppingCart__code}>
                    <form className={styles.shoppingCart__code__form}>
                        <label htmlFor="code">Promote code: </label>
                        <input className={styles.shoppingCart__code__form__input} type="text" pattern='\d*' maxLength={6} id='code' placeholder='XXXXXX' />
                    </form>
                    <div className={styles.shoppingCart__code__total}>
                        <div className={styles.shoppingCart__code__total__label}>To pay:</div>
                        <div className={styles.shoppingCart__code__total__number}><p className={styles.unit}>$</p>{orders?.totalAmount}</div>
                    </div>
                </div>
            </div>
            <div className={styles.cardDetails}>
                <p className={styles.title}>
                    Card Details
                </p>
                <Formik
                    initialValues={initialValue}
                    onSubmit={value => {
                        console.log(value)
                    }}
                >
                    {formikProps => {
                        const { values, errors } = formikProps
                        console.log(values)

                        return (
                            <Form className={styles.form}>
                                <div className={styles.label} id="paymentMethod">Payment method</div>
                                <div className={styles.group__radio} role="group" aria-labelledby="paymentMethod">
                                    <label className={`${styles.radioMethod} ${values.paymentMethod === 'visa' && styles.active}`}>
                                        <Field className={styles.group__radio__input} type="radio" name="paymentMethod" value="visa" />
                                        <img className={styles.radioMethod__img} src="../visaImage.png" />
                                    </label>
                                    <label className={`${styles.radioMethod} ${values.paymentMethod === 'mastercard' && styles.active}`}>
                                        <Field className={styles.group__radio__input} type="radio" name="paymentMethod" value="mastercard" />
                                        <img className={styles.radioMethod__img} src="../mastercardImage.png" />
                                    </label>
                                </div>
                                <label className={styles.label} htmlFor="name">Name and Surname</label>
                                <Field className={styles.inputText} type="text" id='name' name='name' placeholder='Your name' />
                                <label className={styles.label} htmlFor="ccn">Card Number</label>
                                <Field className={styles.inputText} name="cardNumber" type="text" pattern="\d*" maxLength={16} placeholder="XXXX XXXX XXXX XXXX" />
                                <div className={styles.valid}>
                                    <div className={styles.valid__date}>
                                        <div className={styles.label}>Expiration Date</div>
                                        <div className={styles.valid__date__input}>
                                            <Field className={`${styles.inputText} ${styles.date}`} type="number" min={1} max={12} name='month' placeholder='MM' />
                                            <Field className={`${styles.inputText} ${styles.year}`} type="number" min={2022} name='year' placeholder='YYYY' />
                                        </div>
                                    </div>
                                    <div className={styles.valid__cvv}>
                                        <label className={styles.label} htmlFor="cvv">CVV</label>
                                        <Field className={styles.inputText} type="number" name='cvv' id='cvv' max={999} placeholder='XXX' />
                                    </div>
                                </div>
                                <button type='submit' className={styles.button}>Check Out</button>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    );
}

Cart.getLayout = function getLayout(page: ReactElement) {
    return (
        <LayoutUser>
            {page}
        </LayoutUser>
    )
}

export default Cart;