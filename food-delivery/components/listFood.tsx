import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { motion } from 'framer-motion';
import { GetServerSideProps, NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { Categories, Food, OrderUser } from '../models';
import axiosUser from '../pages/api/axiosUser';
import userApi from '../pages/api/userApi';
import { ordersSlice } from '../slices/ordersSlice';
import { store } from '../store';
import styles from '../styles/ListFood.module.scss'

interface Props {
    categories: Array<Categories>,
    foods: Array<Food>,
    selectedCategory: number,
    height: number;
}

function ListFood(props: Props) {
    const { user } = useUser()
    const { categories, foods, selectedCategory, height } = props
    const [showCategory, setShowCategory] = useState<number>(selectedCategory)
    const [listFoods, setListFoods] = useState<Array<Food>>([])
    const [orders, setOrders] = useState<OrderUser>()

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
    }, [showCategory])
    const handleAddOrders = async (idFood: number) => {
        const foodInfo = listFoods.find(food => food.id === idFood)
        if (foodInfo && user?.sub) {
            const actionAddOrder = ordersSlice.actions.add(foodInfo)
            store.dispatch(actionAddOrder)
            try {
                await userApi.addOrder(store.getState().order.current, user.sub)
            } catch (error) {
                console.log('error:' + error)
            }
        }
        // let newOrder = Object.assign({}, orders)
        // if (Object.keys(newOrder).length === 0 && foodInfo) {
        //     const newOrder = {
        //         orderItems: [{
        //             id: foodInfo.id,
        //             img: foodInfo.image,
        //             quantity: 1,
        //             price: foodInfo.price,
        //             name: foodInfo.name
        //         }],
        //         totalAmount: foodInfo.price
        //     }
        //     if (user && typeof (user.sub) == 'string') {
        //         await userApi.addOrder(newOrder, user.sub).
        //             then(async () => {
        //                 const resOrder = await userApi.getUserInfo(user.sub)
        //                 resOrder.data.user_metadata?.orders && setOrders(resOrder.data.user_metadata?.orders)
        //             })
        //     }
        // } else if (newOrder.orderItems && foodInfo && orders) {
        //     const isAlreadyInArray = newOrder.orderItems.filter(order => order?.id === idFood).length > 0
        //     if (isAlreadyInArray) {
        //         const indexInArray = newOrder.orderItems.findIndex(order => order?.id === idFood)
        //         newOrder.orderItems[indexInArray].quantity += 1
        //         newOrder.orderItems[indexInArray].price += foodInfo.price
        //         newOrder.totalAmount += foodInfo.price
        //         if (user && typeof (user.sub) == 'string') {
        //             await userApi.addOrder(newOrder, user.sub).
        //                 then(async () => {
        //                     const resOrder = await userApi.getUserInfo(user.sub)
        //                     resOrder.data.user_metadata?.orders && setOrders(resOrder.data.user_metadata?.orders)
        //                 })
        //         }
        //     } else {
        //         const newOrder = {
        //             orderItems: [...orders.orderItems, {
        //                 id: foodInfo.id,
        //                 img: foodInfo.image,
        //                 quantity: 1,
        //                 price: foodInfo.price,
        //                 name: foodInfo.name
        //             }],
        //             totalAmount: orders.totalAmount + foodInfo.price
        //         }
        //         if (user && typeof (user.sub) == 'string') {
        //             await userApi.addOrder(newOrder, user.sub).
        //                 then(async () => {
        //                     const resOrder = await userApi.getUserInfo(user.sub)
        //                     resOrder.data.user_metadata?.orders && setOrders(resOrder.data.user_metadata?.orders)
        //                 })
        //         }
        //     }
        // }


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