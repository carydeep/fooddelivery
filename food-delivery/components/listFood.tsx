import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { motion } from 'framer-motion';
import { GetServerSideProps, NextPage } from 'next';
import React, { useCallback, useEffect, useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { useAppSelector } from '../hooks';
import { Categories, Food, OrderUser } from '../models';
import axiosUser from '../pages/api/axiosUser';
import userApi from '../pages/api/userApi';
import { ordersSlice } from '../slices/ordersSlice';
import { store } from '../store';
import styles from '../styles/ListFood.module.scss'

interface Props {
    categories: Array<Categories>,
    selectedCategory: number,
    height: number;
}

function ListFood(props: Props) {
    const { user } = useUser()
    const { categories, selectedCategory, height } = props
    const [showCategory, setShowCategory] = useState<number>(selectedCategory)
    const [listFoods, setListFoods] = useState<Array<Food>>([])
    const [orders, setOrders] = useState<OrderUser>()
    const foods = useAppSelector(state => state.food.current)

    useEffect(() => {
        const fetchorder = async () => {
            if (user) {
                const resOrder = await userApi.getUserInfo(user.sub)
                resOrder.data.user_metadata?.orders && setOrders(resOrder.data.user_metadata?.orders)
            }
        }
        fetchorder()
    }, [])

    useEffect(() => {
        setShowCategory(selectedCategory)
    }, [selectedCategory])

    useEffect(() => {
        const changeListFood = () => {
            if (showCategory !== 0) {
                setListFoods(foods.filter(food => food.category === showCategory))
            } else {
                setListFoods(foods)
            }
        }
        changeListFood()
    }, [showCategory, foods])

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
        <div className={styles.listItems}>
            <div className={styles.listItems__header}>
                <div className={styles.listItems__header__name}>All Items</div>
                <div className={styles.select__box}>
                    <select onChange={(e) => setShowCategory(Number(e.target.value))} className={styles.listItems__header__option}>
                        <option value="0">View all</option>
                        {categories.map(category => {
                            return (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
            <motion.div layout className={styles.listItems__content} style={{ height: `${height}px` }}>
                {listFoods.map(food => {
                    return (
                        <motion.div layout className={styles.listItems__content__item} key={food.id}>
                            {food.trend === 'best-seller' &&
                                <div className={styles.listItems__content__item__trend}>
                                    <img className={styles.listItems__content__item__trend__img} src="flame.png" />
                                </div>}
                            {food.trend === 'best-vote' &&
                                <div className={styles.listItems__content__item__trend}>
                                    <img className={styles.listItems__content__item__trend__img} src="heart.png" />
                                </div>}
                            <img className={styles.listItems__content__item__img} src={food.image} />
                            <div className={styles.listItems__content__item__name}>{food.name}</div>
                            <div className={styles.listItems__content__item__descript}>{food.description}</div>
                            <div className={styles.listItems__content__item__info}>
                                <div className={styles.listItems__content__item__info__food}>
                                    <div className={styles.listItems__content__item__info__food__price}>${food.price}</div>
                                    <div className={styles.listItems__content__item__info__food__weight}>{food.weight}g</div>
                                </div>
                                <button type='button' className={styles.listItems__content__item__info__button} onClick={() => handleAddOrders(food.id)} ><BsPlusLg /></button>
                            </div>
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    );
}

export default ListFood;