import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { FaTwitter, FaFacebookF, FaInstagram, FaChevronRight, FaAlignRight } from "react-icons/fa"
import { useEffect, useRef, useState } from 'react'
import foodApi from './api/foodApi'
import { Categories, Food } from '../models'
import { motion } from 'framer-motion'
import { BsPlusLg, BsXLg } from 'react-icons/bs'
import { useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'

const Home = ({ foods, categories }: { foods: Array<Food>, categories: Array<Categories> }) => {
  const { user, error, isLoading } = useUser()

  const [widthSlide, setWidthSlide] = useState<number>(0)
  const [showCategory, setShowCategory] = useState<number>(0)
  const [listFoods, setListFoods] = useState<Array<Food>>([])
  const slide = useRef<null | HTMLDivElement>(null)

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
  useEffect(() => {
    if (slide.current?.scrollWidth != undefined && slide.current?.offsetWidth != undefined) {
      setWidthSlide(slide.current?.scrollWidth - slide.current?.offsetWidth)
    }
  }, [categories])
  console.log(user)
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet" />
      </Head>

      <section className={styles.section1}>
        <div className={styles.contact}>
          <FaTwitter />
          <FaFacebookF />
          <FaInstagram />
        </div>
        <div className={styles.header}>
          <div className={styles.header__left}>
            My Food
          </div>
          <input className={styles.header__input} type='checkbox' id='showBar' />
          <label className={styles.header__bar} htmlFor="showBar"><FaAlignRight /></label>
          <div className={styles.header__right}>
            <ul className={styles.header__right__funct}>
              <label className={styles.header__right__funct__close} htmlFor="showBar"><BsXLg /></label>
              <li className={styles.header__right__funct__item}>Home</li>
              <li className={styles.header__right__funct__item}>Catagory</li>
              <li className={styles.header__right__funct__item}>Catalog</li>
              <li className={styles.header__right__funct__item}>About Us</li>
              <li className={styles.header__right__funct__item}>Reviews</li>
            </ul>
            {user ?
              (
                <a className={styles.header__right__register} href='/api/auth/logout'>LOGOUT</a>
              ) : (
                <a className={styles.header__right__register} href='/api/auth/login'>REGISTER</a>
              )}
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.main__decript}>THE BEST CUISINE AWAITS YOU</div>
          <div className={styles.main__welcome}>Welcome!</div>
          <div className={styles.main__myfood}>To my food</div>
          <div className={styles.main__discount}>
            <div className={styles.main__discount__number}>20%</div>
            <div className={styles.main__discount__discript}> DISCOUNT UPON <br /> REGISTRATION</div>
          </div>
          <button className={styles.main__button}>REGISTER</button>
        </div>
      </section>
      <section className={styles.section2}>
        <motion.div
          ref={slide}
          className={styles.slideCatagory}
          whileTap={{ cursor: "grabbing" }}
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -widthSlide }}
            className={styles.innerSlideCatagory}>
            {categories?.map(category => {
              return (
                <motion.div className={styles.innerSlideCatagory__item} key={category.id}>
                  <img className={styles.innerSlideCatagory__item__img} src={category.image} />
                  <div className={styles.innerSlideCatagory__item__content}>
                    <div className={styles.innerSlideCatagory__item__content__name}>{category.name}</div>
                    <div className={styles.innerSlideCatagory__item__content__descript}>{category.description}</div>
                  </div>
                  <button
                    type='button'
                    className={styles.innerSlideCatagory__item__button}
                    onClick={() => { setShowCategory(category.id) }}
                  ><FaChevronRight /></button>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
        <div className={styles.listItems}>
          <div className={styles.listItems__header}>
            <div className={styles.listItems__header__name}>All Items</div>
            <div className={styles.select__box}>
              <select onChange={(e) => setShowCategory(Number(e.target.value))} className={styles.listItems__header__option}>
                <option value="0">View all</option>
                <option value="2">Fast Food</option>
                <option value="3">Salad</option>
                <option value="6">Fruit</option>
                <option value="5">Side Dishes</option>
                <option value="4">Drink</option>
              </select>
            </div>
          </div>
          <motion.div layout className={styles.listItems__content}>
            {listFoods?.map(food => {
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
                    <button type='button' className={styles.listItems__content__item__info__button}><BsPlusLg /></button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>
      <section className={styles.advertise}>
        <img className={styles.advertise__image} src="advertise.PNG" />
        <div className={styles.ourApp}>
          <img className={styles.ourApp__image} src="our-application.PNG" />
          <div className={styles.ourApp__content}>
            <div className={styles.ourApp__content__name}>Our application</div>
            <div className={styles.ourApp__content__descript}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni soluta beatae reiciendis omnis amet eos distinctio quasi id expedita culpa! Tempora </div>
            <button className={styles.ourApp__content__button}>REGISTER</button>
          </div>
        </div>
      </section>
      <section className={styles.register}>
        <div className={styles.register__title}>
          <div className={styles.register__title__sub}>SUBSCRIBE</div>
          <div className={styles.register__title__news}>TO NEWS</div>
        </div>
        <form className={styles.register__form}>
          <input className={styles.register__form__input} type="email" placeholder='E-mail' />
          <button className={styles.register__form__button} type='button'>REGISTER</button>
        </form>
      </section>
      <section className={styles.footer}>
        <div className={styles.footer__brand}>My Food</div>
        <ul className={styles.footer__option}>
          <li className={styles.footer__option__item}>Home</li>
          <li className={styles.footer__option__item}>Catagory</li>
          <li className={styles.footer__option__item}>Catalog</li>
          <li className={styles.footer__option__item}>About Us</li>
          <li className={styles.footer__option__item}>Reviews</li>
        </ul>
        <ul className={styles.footer__contact}>
          <li><FaTwitter /></li>
          <li><FaInstagram /></li>
          <li><FaFacebookF /></li>
        </ul>
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const resFood = await foodApi.getFood()
  const resCategories = await foodApi.getCategories()
  return {
    props: {
      foods: resFood,
      categories: resCategories
    }
  }
}

export default Home
