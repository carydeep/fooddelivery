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
    getFoodByCategory: (category: number): Promise<Array<Food>> => {
        const url = `/food?category=${category}`;
        return axiosClient.get(url);
    }
}

export default foodApi;