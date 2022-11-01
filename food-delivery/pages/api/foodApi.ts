import { Categories, Food } from "../../models";
import axiosClient from "./axiosClient";

const foodApi = {
    getCategories: (): Promise<Array<Categories>> => {
        const url = '/categories';
        return axiosClient.get(url);
    },
    getFood: (): Promise<Array<Food>> => {
        const url = '/food';
        return axiosClient.get(url);
    },
    createFood:(data:any)=>{
        const url = '/food';
        return axiosClient.post(url,data)
    },
    getFoodByCategory: (category: number): Promise<Array<Food>> => {
        const url = `/food?category=${category}`;
        return axiosClient.get(url);
    },
    addOrderDeliver: (name: string, phoneNumber: string, address: string) => {
        const url = `/orderDeliver`;
        const value = {
            'name': name,
            'phoneNumber': phoneNumber,
            'address': address
        }
        return axiosClient.post(url, value)
    }
}

export default foodApi;