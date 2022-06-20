import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { HistoryOrders, OrderItem, OrderUser } from "../../models";
import { card } from "../../models/user";
import axiosUser from "./axiosUser";

const userApi = {
    getUserInfo: (userId: any) => {
        const url = `/api/v2/users/${userId}`
        return axiosUser.get(url)
    },
    updateUserInfo: (userId: any, profile: any) => {
        const url = `/api/v2/users/${userId}`
        const body = {
            "user_metadata": {
                'name': profile.name,
                "address": profile.address,
                "phoneNumber": profile.phoneNumber,
                "instagram": profile.instagram
            }
        }
        return axiosUser.patch(url, body)
    },
    postCard: (userId: any, data1: card) => {
        const url = `/api/v2/users/${userId}`;
        const data = {
            user_metadata: {
                cards: [data1]
            }
        }
        return axiosUser.post(url, data);
    },
    getOrder: (idUser: number) => {
        const url = `/api/v2/users/${idUser}`
        return axiosUser.get(url)
    },
    addOrder: (order: OrderUser | undefined, idUser: string) => {
        const url = `/api/v2/users/${idUser}`
        const body = {
            "user_metadata": {
                "orders": order
            }
        }
        return axiosUser.patch(url, body)
    },
    addHistoryOrders: (order: HistoryOrders, idUser: string) => {
        const url = `/api/v2/users/${idUser}`
        const body = {
            "user_metadata": {
                "historyOrders": order
            }
        }
        return axiosUser.patch(url, body)
    },
    removeOrder: (order: OrderUser | undefined, idUser: string) => {
        const url = `/api/v2/users/${idUser}`
        const body = {
            "user_metadata": {
                "orders": order
            }
        }
        return axiosUser.patch(url, body)
    },
    deleteOrders: (idUser: string) => {
        const url = `/api/v2/users/${idUser}`
        const body = {
            "user_metadata": {
                "orders": {
                    "orderItems": [],
                    "totalAmount": 0
                }
            }
        }
        return axiosUser.patch(url, body)
    },
}

export default userApi;