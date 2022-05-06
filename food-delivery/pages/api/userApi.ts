import { AxiosRequestConfig, AxiosResponse } from "axios";
import { OrderItem, OrderUser } from "../../models";
import { card } from "../../models/user";
import axiosUser from "./axiosUser";

const userApi = {
    getUserInfo: (userId: any) => {
        const url = `/api/v2/users/${userId}`
        return axiosUser.get(url)
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
    removeOrder: (order: OrderUser | undefined, idUser: string) => {
        const url = `/api/v2/users/${idUser}`
        const body = {
            "user_metadata": {
                "orders": order
            }
        }
        return axiosUser.patch(url, body)
    }
}

export default userApi;