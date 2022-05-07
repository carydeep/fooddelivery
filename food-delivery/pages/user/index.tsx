import { useUser } from '@auth0/nextjs-auth0';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import styles from '../../styles/User.module.scss'
import { GetServerSideProps } from 'next';
import foodApi from '../api/foodApi';
import { Categories, Food } from '../../models';
import ListFood from '../../components/listFood';
import { BsChevronRight, BsPlusLg } from 'react-icons/bs';
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { getOrders, ordersSlice } from '../../slices/ordersSlice';
import { store } from '../../store';
import { useAppSelector } from '../../hooks';
import { getFoods } from '../../slices/foodSlice';
import userApi from '../api/userApi';
import LayoutUser from '../../layouts/layoutUser';

function User({ categories }: { categories: Array<Categories> }) {
    const { user } = useUser()
    const [selectedCategory, setSelectedCategory] = useState<number>(0)
    const [promote, setPromote] = useState<Array<Food>>([])
    const orders = useAppSelector(state => state.order.current)
    const foods = useAppSelector(state => state.food.current)
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

    useEffect(() => {
        const filterHotTrend = () => {
            const listTrend = foods.filter(food => {
                return food.trend !== 'none'
            })
            setPromote(listTrend.slice(0, 2))
        }
        filterHotTrend()
    }, [foods])

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
    );
}

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
    async getServerSideProps() {
        const resCategories = await foodApi.getCategories()
        return {
            props: {
                categories: resCategories
            }
        }
    }
})

export default User;

User.getLayout = function getLayout(page: ReactElement) {
    return (
        <LayoutUser>
            {page}
        </LayoutUser>
    )
}