import React from 'react';
import styles from '../../styles/CardFood.module.scss'
import { motion } from 'framer-motion'
import { Food } from '../../models';
import { BsPlusLg } from 'react-icons/bs';

interface Props {
    food: Food,
    handleAddOrders: Function
}

function CardFood(props: Props) {
    const { id, trend, image, name, description, price, weight } = props.food
    const { handleAddOrders } = props

    return (
        <motion.div layout className={styles.listItems__content__item}>
            {trend === 'best-seller' &&
                <div className={styles.listItems__content__item__trend}>
                    <img className={styles.listItems__content__item__trend__img} src="flame.png" />
                </div>}
            {trend === 'best-vote' &&
                <div className={styles.listItems__content__item__trend}>
                    <img className={styles.listItems__content__item__trend__img} src="heart.png" />
                </div>}
            <img className={styles.listItems__content__item__img} src={image} />
            <div className={styles.listItems__content__item__name}>{name}</div>
            <div className={styles.listItems__content__item__descript}>{description}</div>
            <div className={styles.listItems__content__item__info}>
                <div className={styles.listItems__content__item__info__food}>
                    <div className={styles.listItems__content__item__info__food__price}>${price}</div>
                    <div className={styles.listItems__content__item__info__food__weight}>{weight}g</div>
                </div>
                <button type='button' className={styles.listItems__content__item__info__button} onClick={() => handleAddOrders(id)} ><BsPlusLg /></button>
            </div>
        </motion.div>
    );
}

export default CardFood;