import { useUser } from '@auth0/nextjs-auth0';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import LayoutUser from '../../layouts/layoutUser';
import styles from '../../styles/Catalog.module.scss'
import { BsCupStraw, BsTelephone } from 'react-icons/bs';
import { SiInstagram } from 'react-icons/si'
import { FiMail } from 'react-icons/fi'
import { BiPencil } from 'react-icons/bi'
import EditProfile from '../../components/popUp/editProfile';
import { store } from '../../store';
import { getOrders } from '../../slices/ordersSlice';
import { useAppSelector } from '../../hooks';
import { GiHamburger } from 'react-icons/gi'
import { IoFastFood } from 'react-icons/io5'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HistoryOrders } from '../../models';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
);



function Catalog() {
    const { user } = useUser()
    const [orderSet, setOrderSet] = useState<Array<number>>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [orderFood, setOrderFood] = useState<Array<number>>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [orderDrink, setOrderDrink] = useState<Array<number>>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [staticDrink, setStaticDrink] = useState<any>()
    const [staticFood, setStaticFood] = useState<any>()
    const [staticSets, setStaticSets] = useState<any>()
    const [showPopUp, setShowPopUp] = useState<boolean>(false)
    const thisMonth = new Date().getMonth()
    const foods = useAppSelector(state => state.food.current)
    const userInfo = useAppSelector(state => state.userInfo.current.user_metadata)
    const handleChangeShowPopUp = useCallback(() => {
        setShowPopUp(!showPopUp)
    }, [showPopUp])
    useEffect(() => {
        const updateOrder = async () => {
            if (user?.sub) {
                await store.dispatch(getOrders(user.sub))
            }
        }
        updateOrder()
    }, [user])

    useEffect(() => {
        const countOrderByMonth = () => {
            if (!userInfo) return
            if (!userInfo.historyOrders) return
            if (foods.length === 0) return
            let countSet = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            let countFood = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            let countDrink = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            userInfo.historyOrders.map((item: HistoryOrders) => {
                const getMonth = new Date(item.createdAt).getMonth()
                item.orderItems.map(order => {
                    if (foods[order.id - 1].category != 4) {
                        countFood[getMonth] += 1
                    } else {
                        countDrink[getMonth] += 1
                    }
                })
                if (item.orderItems.length > 1) {
                    countSet[getMonth] += 1
                }
            })
            setOrderDrink(countDrink)
            setOrderFood(countFood)
            setOrderSet(countSet)
        }
        countOrderByMonth()

    }, [userInfo, foods])

    useEffect(() => {
        setStaticDrink(caculateOrder(orderDrink))
        setStaticFood(caculateOrder(orderFood))
        setStaticSets(caculateOrder(orderSet))
    }, [orderDrink, orderFood, orderSet])

    const caculateOrder = (orderByMonth: Array<number>) => {
        let rateCompare = 0
        const orders = orderByMonth.reduce((total, num) => total + num, 0)
        if (orderByMonth[thisMonth] > orderByMonth[thisMonth - 1]) {
            if (orderByMonth[thisMonth - 1] > 0) {
                rateCompare = (orderByMonth[thisMonth] / orderByMonth[thisMonth - 1]) * 100
            } else {
                rateCompare = 999
            }
        } else {
            if (orderByMonth[thisMonth] > 0) {
                rateCompare = (orderByMonth[thisMonth - 1] / orderByMonth[thisMonth]) * -100
            } else {
                rateCompare = -999
            }
        }
        return {
            'orders': orders,
            'rateCompare': rateCompare
        }
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Order Statistics',
                color: '#ffffff',
                font: {
                    size: 20
                },
                align: 'start' as const,
                padding: {
                    bottom: 20,
                }
            },
            legend: {
                labels: {
                    usePointStyle: true
                },
                align: 'start' as const,
                display: false
            }
        },
        scales: {
            y: {
                display: true,
                min: 0,
                ticks: {
                    color: '#414046',
                    font: {
                        size: 10
                    },
                },
                grid: {
                    borderDash: [10, 5],
                    color: '#414046'
                }
            },
            x: {
                display: true,
                ticks: {
                    color: '#414046',
                    font: {
                        size: 10
                    }
                },
            }
        }
    };

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Order Set',
                fill: true,
                data: orderSet,
                borderColor: 'rgb(113, 255, 25)',
                backgroundColor: 'rgba(113, 255, 25,0.2)',
                cubicInterpolationMode: 'monotone' as const,
                borderWidth: 3,
                pointStyle: 'circle',
                pointRadius: 5,
                pointBorderColor: 'white'
            },
            {
                label: 'Order Food',
                fill: true,
                data: orderFood,
                borderColor: 'rgb(255, 57, 57)',
                backgroundColor: 'rgba(255, 57, 57,0.2)',
                cubicInterpolationMode: 'monotone' as const,
                borderWidth: 3,
                pointStyle: 'circle',
                pointRadius: 5,
                pointBorderColor: 'white'
            },
            {
                label: 'Order Drink',
                fill: true,
                data: orderDrink,
                borderColor: 'rgb(27, 99, 255)',
                backgroundColor: 'rgba(27, 99, 255,0.2)',
                cubicInterpolationMode: 'monotone' as const,
                borderWidth: 3,
                pointStyle: 'circle',
                pointRadius: 5,
                pointBorderColor: 'white'
            },
        ],
    };

    const optionsSmallChart = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: false,
            },
            legend: {
                labels: {
                    usePointStyle: true
                },
                align: 'start' as const,
                display: false
            }
        },
        scales: {
            y: {
                display: false,
            },
            x: {
                display: false,
            }
        }
    };

    const dataDrinks = {
        labels,
        datasets: [
            {
                label: 'Order Set',
                data: orderDrink,
                borderColor: 'rgb(27, 99, 255)',
                cubicInterpolationMode: 'monotone' as const,
                borderWidth: 2,
                pointStyle: 'none',
                pointRadius: 0,
                pointBorderColor: 'white'
            }
        ]
    }

    const dataFood = {
        labels,
        datasets: [
            {
                label: 'Order Set',
                data: orderFood,
                borderColor: 'rgb(255, 57, 57)',
                cubicInterpolationMode: 'monotone' as const,
                borderWidth: 2,
                pointStyle: 'none',
                pointRadius: 0,
                pointBorderColor: 'white'
            }
        ]
    }

    const dataSets = {
        labels,
        datasets: [
            {
                label: 'Order Set',
                data: orderSet,
                borderColor: 'rgb(113, 255, 25)',
                cubicInterpolationMode: 'monotone' as const,
                borderWidth: 2,
                pointStyle: 'none',
                pointRadius: 0,
                pointBorderColor: 'white'
            }
        ]
    }


    return (
        <>
            {showPopUp &&
                <EditProfile
                    showPopUp={showPopUp}
                    onShow={handleChangeShowPopUp}
                ></EditProfile>
            }
            <div className={styles.profile}>
                <img className={styles.img} src={user?.picture || undefined} />
                <div className={styles.info}>
                    <div className={styles.top}>
                        <h3>{userInfo?.name}</h3>
                        <button onClick={() => setShowPopUp(true)} className={styles.button}><BiPencil className={styles.icon} />EDIT PROFILE</button>
                    </div>
                    <p className={styles.mid}>{userInfo?.address || 'Address'}</p>
                    <div className={styles.bottom}>
                        <div className={styles.card}><BsTelephone className={`${styles.icon} ${styles.phone}`} />{userInfo?.phoneNumber || 'Phone number'}</div>
                        <div className={styles.card}><FiMail className={`${styles.icon} ${styles.email}`} />{user?.email || 'Email'}</div>
                        <div className={styles.card}><SiInstagram className={`${styles.icon} ${styles.insta}`} />{userInfo?.instagram || 'Instagram'}</div>
                    </div>
                </div>
            </div>
            <div className={styles.chartContainer}>
                <Line className={styles.chart} options={options} data={data} />;
            </div>
            <div className={styles.chartContainerSmall}>
                <div className={styles.static}>
                    <div className={styles.title}>
                        <div className={styles.left}>
                            <BsCupStraw className={`${styles.icon} ${styles.drinks}`} />
                            <p>THE DRINKS</p>
                        </div>
                        <p className={styles.drinks}>{staticDrink?.rateCompare}%</p>
                    </div>
                    <div className={styles.bottom}>
                        <p className={styles.text}><h3 className={styles.number}>{staticDrink?.orders || 0}</h3> orders</p>
                        <div className={styles.chart}>
                            <Line options={optionsSmallChart} data={dataDrinks} />
                        </div>
                    </div>
                </div>
                <div className={styles.static}>
                    <div className={styles.title}>
                        <div className={styles.left}>
                            <GiHamburger className={`${styles.icon} ${styles.food}`} />
                            <p>FOOD</p>
                        </div>
                        <p className={styles.food}>{staticFood?.rateCompare}%</p>
                    </div>
                    <div className={styles.bottom}>
                        <p className={styles.text}><h3 className={styles.number}>{staticFood?.orders || 0}</h3> orders</p>
                        <div className={styles.chart}>
                            <Line options={optionsSmallChart} data={dataFood} />
                        </div>
                    </div>
                </div>
                <div className={styles.static}>
                    <div className={styles.title}>
                        <div className={styles.left}>
                            <IoFastFood className={`${styles.icon} ${styles.sets}`} />
                            <p>SETS</p>
                        </div>
                        <p className={styles.sets}>{staticSets?.rateCompare}%</p>
                    </div>
                    <div className={styles.bottom}>
                        <p className={styles.text}><h3 className={styles.number}>{staticSets?.orders || 0}</h3> orders</p>
                        <div className={styles.chart}>
                            <Line options={optionsSmallChart} data={dataSets} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Catalog.getLayout = function getLayout(page: ReactElement) {
    return (
        <LayoutUser>
            {page}
        </LayoutUser>
    )
}

export default Catalog;