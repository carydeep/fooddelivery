import { useUser } from "@auth0/nextjs-auth0";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
import { Categories, Food } from "../models";
import userApi from "../pages/api/userApi";
import { ordersSlice } from "../slices/ordersSlice";
import { store } from "../store";
import styles from "../styles/ListFood.module.scss";
import CardFood from "./Card/food";

interface Props {
  categories: Array<Categories>;
  selectedCategory: number;
  height: number;
}

function ListFood(props: Props) {
  const { user } = useUser();
  const { categories, selectedCategory, height } = props;
  const [showCategory, setShowCategory] = useState<number>(selectedCategory);
  const [listFoods, setListFoods] = useState<Array<Food>>([]);
  const foods = useAppSelector((state) => state.food.current);

  useEffect(() => {
    setShowCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    const changeListFood = () => {
      if (showCategory !== 0) {
        setListFoods(foods.filter((food) => food.category === showCategory));
      } else {
        setListFoods(foods);
      }
    };
    changeListFood();
  }, [showCategory, foods]);

  const handleAddOrders = async (idFood: number) => {
    const foodInfo = foods.find((food) => food.id === idFood);
    if (foodInfo && user?.sub) {
      const actionAddOrder = ordersSlice.actions.add(foodInfo);
      store.dispatch(actionAddOrder);
      try {
        await userApi.addOrder(store.getState().order.current, user.sub);
        await userApi.backupOrder(user.sub, store.getState().order.current);
      } catch (error) {
        console.log("error:" + error);
      }
    }
  };

  return (
    <div className={styles.listItems}>
      <div className={styles.listItems__header}>
        <div className={styles.listItems__header__name}>All Items</div>
        <div className={styles.select__box}>
          <select
            onChange={(e) => setShowCategory(Number(e.target.value))}
            className={styles.listItems__header__option}
          >
            <option value="0">View all</option>
            {categories.map((category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <motion.div
        layout
        className={styles.listItems__content}
        style={{ height: `${height}px` }}
      >
        {listFoods.map((food) => {
          return (
            <CardFood
              key={food.id}
              food={food}
              handleAddOrders={handleAddOrders}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

export default ListFood;
