import React, { memo, ReactNode, useCallback, useEffect, useState } from 'react';
import styles from '../styles/LayoutUser.module.scss'
import PopUpShoppingCart from '../components/popUp/shoppingCart';
import { useAppSelector } from '../hooks';
import { store } from '../store';
import userApi from '../pages/api/userApi';
import { getOrders, ordersSlice } from '../slices/ordersSlice';
import { useUser } from '@auth0/nextjs-auth0';
import { BiCategory, BiDownload, BiMap } from 'react-icons/bi'
import { MdDeliveryDining, MdOutlineShoppingBag } from 'react-icons/md'
import { GoSettings } from 'react-icons/go'
import { BsInboxes, BsSearch } from 'react-icons/bs'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { IoLogOutOutline } from 'react-icons/io5'
import { AiOutlineHome } from 'react-icons/ai'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getUser } from '../slices/userSlice';

function LayoutUser({ children }: { children: ReactNode }) {
    const { user } = useUser()
    const router = useRouter()
    const [showShoppingCart, setShowShoppingCart] = useState<boolean>(false)
    const orders = useAppSelector(state => state.order.current)
    const foods = useAppSelector(state => state.food.current)
    const userInfo = useAppSelector(state => state.userInfo.current.user_metadata)

    useEffect(() => {
        const updateOrder = async () => {
            if (user?.sub) {
                await store.dispatch(getOrders(user.sub))
            }
        }
        const updateUser = async () => {
            if (user?.sub) {
                await store.dispatch(getUser(user.sub))
            }
        }
        updateOrder()
        updateUser()
    }, [user])

    const handeChangeShowShoppingCart = useCallback(() => {
        setShowShoppingCart(!showShoppingCart)
    }, [showShoppingCart])

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
    return (
        <div className={styles.container}>
            {showShoppingCart && (
                <PopUpShoppingCart
                    orders={orders}
                    showPopUp={showShoppingCart}
                    onShow={handeChangeShowShoppingCart}
                    addOrder={handleAddOrders}
                />
            )}
            <div className={styles.function}>
                <img className={styles.function__image} src={user?.picture || undefined} />
                <h3 className={styles.function__name}>{userInfo?.name || user?.name}</h3>
                <ul className={styles.function__option}>
                    <li className={`${styles.function__option__item} ${router.asPath === '/user' && styles.active}`}>
                        <Link href={`/user`}>
                            <a><AiOutlineHome className={styles.function__option__item__icon} />Home</a>
                        </Link>
                    </li>
                    <li className={`${styles.function__option__item} ${router.asPath === '/user/catalog' && styles.active}`}>
                        <Link href={`/user/catalog`}>
                            <a><BsInboxes className={styles.function__option__item__icon} />Catalog</a>
                        </Link>
                    </li>
                    <li className={styles.function__option__item}>
                        <BiCategory className={styles.function__option__item__icon} />Category
                    </li>
                    <li className={styles.function__option__item}>
                        <BiMap className={styles.function__option__item__icon} />Map
                    </li>
                    <li className={styles.function__option__item}>
                        <MdDeliveryDining className={styles.function__option__item__icon} />Delivery
                    </li>
                    <li className={styles.function__option__item}>
                        <GoSettings className={styles.function__option__item__icon} />Setting
                    </li>
                </ul>
                <img src='../advertise-app.png' className={styles.function__advertise}></img>
                <div className={styles.function__download}><BiDownload className={styles.function__download__icon} />Mobile App</div>
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <form className={styles.header__form} >
                        <input list='listFood' className={styles.header__form__input} type="text" placeholder='Search...' />
                        <datalist id='listFood'>
                            {foods && foods.map(food => {
                                return (
                                    <option key={food.id} value={food.name}></option>
                                )
                            })}
                        </datalist>
                        <button className={styles.header__form__button}><BsSearch /></button>
                    </form>
                    <ul className={styles.header__notice}>
                        <li style={{ position: 'relative' }}><IoMdNotificationsOutline className={styles.header__notice__item} /></li>
                        <li style={{ position: 'relative' }} onClick={() => setShowShoppingCart(!showShoppingCart)}>
                            <MdOutlineShoppingBag className={styles.header__notice__item} />
                            {orders?.orderItems && <span className={styles.header__notice__note}>{orders.orderItems.length}</span>}
                        </li>
                        <li style={{ position: 'relative' }}><Link href='/api/auth/logout'><a><IoLogOutOutline className={`${styles.header__notice__item} ${styles.warning}`} /></a></Link></li>
                    </ul>
                </div>
                <div className={styles.main}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default memo(LayoutUser);