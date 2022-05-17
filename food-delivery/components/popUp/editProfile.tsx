import { Field, Form, Formik } from 'formik';
import React, { memo, useEffect, useRef } from 'react';
import styles from '../../styles/PopUpOrderBox.module.scss'
import * as Yup from 'yup'
import { useUser } from '@auth0/nextjs-auth0';
import axios from 'axios';
import userApi from '../../pages/api/userApi';
import { userSlice } from '../../slices/userSlice';
import { store } from '../../store';
import { useAppSelector } from '../../hooks';

interface Props {
    showPopUp: boolean,
    onShow: Function,
}

function EditProfile(props: Props) {
    const { user } = useUser()
    const { onShow, showPopUp } = props
    const ref = useRef<HTMLDivElement>(null)
    const userInfo = useAppSelector(state => state.userInfo.current.user_metadata)
    const initialValue = {
        name: userInfo?.name || '',
        address: userInfo?.address || '',
        phoneNumber: userInfo?.phoneNumber || '',
        instagram: userInfo?.instagram || ''
    }

    const validateShema = Yup.object().shape({
        name: Yup.string().required('This field is required'),
        address: Yup.string(),
        phoneNumber: Yup.string(),
        instagram: Yup.string()
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
                <h3 className={styles.title}>Profile</h3>
                <Formik
                    initialValues={initialValue}
                    validationSchema={validateShema}
                    onSubmit={async (value) => {
                        if (value !== initialValue && user) {
                            const res = await userApi.updateUserInfo(user.sub, value)
                            const actionUser = userSlice.actions.update(value)
                            store.dispatch(actionUser)
                            await onShow()
                        }
                    }}
                >
                    {formikProps => {
                        const { values, errors } = formikProps
                        values.phoneNumber = phoneFormat(values.phoneNumber)

                        return (
                            <Form className={styles.form}>
                                <label className={styles.label} htmlFor="name">Name</label>
                                <Field className={styles.inputText} type="text" id='name' name='name' placeholder='Your name' />
                                {errors.name && <span className={styles.error}>{errors.name}</span>}
                                <label className={styles.label} htmlFor="address">Address</label>
                                <Field className={styles.inputText} type="text" id='address' name='address' placeholder='Your address to deliver' />
                                {errors.address && <span className={styles.error}>{errors.address}</span>}
                                <label className={styles.label} >Phone number</label>
                                <Field className={styles.inputText} name="phoneNumber" type="tel" placeholder="Your telephone number" maxLength={12} />
                                {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
                                <label className={styles.label} htmlFor="instagram">Instagram</label>
                                <Field className={styles.inputText} type="text" id='instagram' name='instagram' placeholder='Your instagram' />
                                <button type='submit' className={styles.button}>Update Now</button>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    );
}

export default memo(EditProfile);