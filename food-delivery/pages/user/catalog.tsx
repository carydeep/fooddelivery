import { useUser } from '@auth0/nextjs-auth0';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import LayoutUser from '../../layouts/layoutUser';
import userApi from '../api/userApi';
import styles from '../../styles/Catalog.module.scss'
import { BsTelephone } from 'react-icons/bs';
import { SiInstagram } from 'react-icons/si'
import { FiMail } from 'react-icons/fi'
import { BiPencil } from 'react-icons/bi'
import EditProfile from '../../components/popUp/editProfile';
import { store } from '../../store';
import { getOrders } from '../../slices/ordersSlice';
import { useAppSelector } from '../../hooks';
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
import { Line, Pie } from 'react-chartjs-2';

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
    const [showPopUp, setShowPopUp] = useState<boolean>(false)
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

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                fill: true,
                data: [0, 2, 4, 5, 5, 3, 7],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                cubicInterpolationMode: 'monotone' as const,
                borderWidth: 3,
                pointStyle: 'circle',
                pointRadius: 5,
                pointBorderColor: 'white'
            },
            {
                label: 'Dataset 2',
                data: [0, 150, 30, 60],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                cubicInterpolationMode: 'monotone' as const,
                fill: true,
                borderWidth: 3,
                pointStyle: 'circle',
                pointRadius: 5,
                pointBorderColor: 'white'
            },
        ],
    };


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