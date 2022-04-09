import { useUser } from '@auth0/nextjs-auth0';
import React, { useCallback, useEffect, useState } from 'react';
import styles from '../styles/User.module.scss'
import { AiOutlineHome } from 'react-icons/ai'
import { BiCategory, BiDownload, BiMap } from 'react-icons/bi'
import { MdDeliveryDining, MdOutlineShoppingBag } from 'react-icons/md'
import { GoSettings } from 'react-icons/go'
import { BsInboxes, BsPlusLg, BsSearch } from 'react-icons/bs'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { IoLogOutOutline } from 'react-icons/io5'
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import foodApi from './api/foodApi';
import { Categories, Food, OrderUser } from '../models';
import ListFood from '../components/listFood';
import { BsChevronRight } from 'react-icons/bs';
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import userApi from './api/userApi';
import axiosUser from './api/axiosUser';
import PopUpShoppingCart from '../components/popUp/shoppingCart';

function User({ foods, categories }: { foods: Array<Food>, categories: Array<Categories> }) {
    const { user } = useUser()
    const [selectedCategory, setSelectedCategory] = useState<number>(0)
    const [promote, setPromote] = useState<Array<Food>>([])
    const [showShoppingCart, setShowShoppingCart] = useState<boolean>(false)
    const [orders, setOrders] = useState<OrderUser>()
    useEffect(() => {
        const fetchorder = async () => {
            if (user) {
                const resOrder = await userApi.getUserInfo(user.sub)
                resOrder.data.user_metadata?.orders && setOrders(resOrder.data.user_metadata?.orders)
            }
        }
        fetchorder()
    }, [user])
    console.log(orders)
    useEffect(() => {
        const filterHotTrend = () => {
            const listTrend = foods.filter(food => {
                return food.trend !== 'none'
            })
            setPromote(listTrend.slice(0, 2))
        }
        filterHotTrend()
        const getUser = async () => {
            if (user) {
                const res = await userApi.getUserInfo(user.sub)
            }
        }
        getUser()
    }, [user])

    const handeChangeShowShoppingCart = useCallback(() => {
        setShowShoppingCart(!showShoppingCart)
    }, [showShoppingCart])

    const handeAddOrder = (idFood: number) => {

    }
    return (
        <div className={styles.container}>
            {showShoppingCart && (
                <PopUpShoppingCart
                    orders={orders}
                    showPopUp={showShoppingCart}
                    onShow={handeChangeShowShoppingCart}
                />
            )}
            <div className={styles.function}>
                <img className={styles.function__image} src={user?.picture || undefined} />
                <h3 className={styles.function__name}>{user?.name}</h3>
                <ul className={styles.function__option}>
                    <li className={`${styles.function__option__item} ${styles.active}`}>
                        <AiOutlineHome className={styles.function__option__item__icon} />Home
                    </li>
                    <li className={styles.function__option__item}>
                        <BsInboxes className={styles.function__option__item__icon} />Catalog
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
                <img src='advertise-app.png' className={styles.function__advertise}></img>
                <div className={styles.function__download}><BiDownload className={styles.function__download__icon} />Mobile App</div>
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <form className={styles.header__form} >
                        <input list='listFood' className={styles.header__form__input} type="text" placeholder='Search...' />
                        <datalist id='listFood'>
                            {foods.map(food => {
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
                            {orders?.orderItems && <span className={styles.header__notice__note}>{orders?.orderItems.length}</span>}
                        </li>
                        <li style={{ position: 'relative' }}><Link href='/api/auth/logout'><a><IoLogOutOutline className={`${styles.header__notice__item} ${styles.warning}`} /></a></Link></li>
                    </ul>
                </div>
                <div className={styles.main}>
                    <div className={styles.main__listfood}>
                        <div className={styles.main__listfood__categories}>
                            <button onClick={() => setSelectedCategory(0)} className={`${styles.main__listfood__categories__button} ${selectedCategory === 0 && styles.active}`} type='button'>
                                <img className={styles.main__listfood__categories__button__img} src="AllFood.png" alt="" />
                                <div className={styles.main__listfood__categories__button__name}>AllFood</div>
                            </button>
                            {categories.map(category => {
                                return (
                                    <button
                                        onClick={() => setSelectedCategory(category.id)}
                                        key={category.id}
                                        className={`${styles.main__listfood__categories__button} ${selectedCategory === category.id && styles.active}`} type='button'>
                                        <img className={styles.main__listfood__categories__button__img} src={category.image} />
                                        <div className={styles.main__listfood__categories__button__name}>{category.name}</div>
                                    </button>
                                )
                            })}
                        </div>
                        <div className={styles.main__listfood__container}>
                            <ListFood
                                categories={categories}
                                foods={foods}
                                selectedCategory={selectedCategory}
                                height={305}
                            />
                        </div>
                    </div>
                    <div className={styles.suggestion}>
                        <div className={styles.suggestion__advertise}>
                            <button className={styles.suggestion__advertise__button} type='button'>View detail <BsChevronRight className={styles.suggestion__advertise__button__icon} /></button>
                            <div className={styles.suggestion__advertise__number}>-30% off</div>
                            <div className={styles.suggestion__advertise__sub}>the full price of rolls</div>
                            <img className={styles.suggestion__advertise__img} src="sugges-advertise.png" />
                        </div>
                        <div className={styles.suggestion__promote}>
                            <div className={styles.suggestion__promote__name}>Promotional Kits</div>
                            <div className={styles.suggestion__promote__list}>
                                {promote.map(pro => {
                                    return (
                                        <div key={pro.id} className={styles.suggestion__promote__card}>
                                            <div className={styles.suggestion__promote__card__img}>
                                                <img className={styles.suggestion__promote__card__img__item} src={pro.image} />
                                            </div>
                                            <div className={styles.suggestion__promote__card__content}>
                                                <div className={styles.suggestion__promote__card__content__name}>{pro.name}</div>
                                                <div className={styles.suggestion__promote__card__content__sub}>{pro.description}</div>
                                                <div className={styles.suggestion__promote__card__content__weight}>{pro.weight}g</div>
                                                <div className={styles.suggestion__promote__card__content__price}>${pro.price}</div>
                                                <img src={pro.trend == 'best-seller' ? 'flame.png' : 'heart.png'} className={styles.suggestion__promote__card__content__trend}></img>
                                                <button className={styles.suggestion__promote__card__content__button} type='button'><BsPlusLg /></button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
    async getServerSideProps() {
        const resFood = await foodApi.getFood()
        const resCategories = await foodApi.getCategories()
        return {
            props: {
                foods: resFood,
                categories: resCategories
            }
        }
    }
})

export default User;