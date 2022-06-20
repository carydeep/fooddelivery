import { Field, Form, Formik } from 'formik';
import React, { memo, useEffect, useRef } from 'react';
import styles from '../../styles/PopUpOrderBox.module.scss'
import * as Yup from 'yup'
import { Payment } from '../../pages/user/cart';
import { useAppSelector } from '../../hooks';
import userApi from '../../pages/api/userApi';
import { useUser } from '@auth0/nextjs-auth0';
import foodApi from '../../pages/api/foodApi';
import { ordersSlice } from '../../slices/ordersSlice';
import { store } from '../../store';
import { userSlice } from '../../slices/userSlice';

interface Props {
    orderConfirm: Payment,
    showPopUp: boolean,
    onShow: Function,
}

function OrderBox(props: Props) {
    const { onShow, orderConfirm, showPopUp } = props
    const { user } = useUser()
    const orders = useAppSelector(state => state.order.current)
    const userInfo = useAppSelector(state => state.userInfo.current.user_metadata)
    const ref = useRef<HTMLDivElement>(null)
    const initialValueToOrder = {
        address: '',
        phoneNumber: ''
    }

    const validateOrderShema = Yup.object().shape({
        address: Yup.string().required('This field is required').min(2, 'Must type correct address'),
        phoneNumber: Yup.string().required('This field is required')
    })

    const phoneFormat = (value: string) => {
        return value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    }

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
            <div className={styles.boxOrder} ref={ref}>
                <h3 className={styles.title}>Orders</h3>
                <Formik
                    initialValues={initialValueToOrder}
                    validationSchema={validateOrderShema}
                    onSubmit={async (value) => {
                        if (!orders) return
                        const { name } = orderConfirm
                        const { phoneNumber, address } = value
                        const historyOrder = {
                            "orderItems": orders.orderItems,
                            "createdAt": Date.now(),
                            "updatedAt": Date.now()
                        }
                        if (user?.sub) {
                            const actionAddHistoryOrder = userSlice.actions.addHistoryOrder(historyOrder)
                            store.dispatch(actionAddHistoryOrder)
                            await userApi.addHistoryOrders(store.getState().userInfo.current.user_metadata.historyOrders, user.sub)
                            await foodApi.addOrderDeliver(name, phoneNumber, address)
                            const actionDeleteAll = ordersSlice.actions.deleteAll()
                            store.dispatch(actionDeleteAll)
                            await userApi.removeOrder(store.getState().order.current, user.sub).then(onShow())
                        }
                    }}
                >
                    {formikProps => {
                        const { values, errors } = formikProps
                        values.phoneNumber = phoneFormat(values.phoneNumber)

                        return (
                            <Form className={styles.form}>
                                <label className={styles.label} htmlFor="address">Address</label>
                                <Field className={styles.inputText} type="text" id='address' name='address' placeholder='Your address to deliver' />
                                {errors.address && <span className={styles.error}>{errors.address}</span>}
                                <label className={styles.label} >Phone number</label>
                                <Field className={styles.inputText} name="phoneNumber" type="tel" placeholder="Your telephone number" maxLength={12} />
                                {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
                                <button type='submit' className={styles.button}>Order Now</button>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    );
}

export default memo(OrderBox);