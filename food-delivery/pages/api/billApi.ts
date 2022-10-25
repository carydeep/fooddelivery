import axiosBackup from "./axiosBackup"

const billApi = {
    createBill:(userID:string,name:string,price:number,methodPayment:string,order:any)=>{
        const url = "/api/bill/post"
        const body = {
            userID,name,price,methodPayment,order
        }
        return axiosBackup.post(url,body)
    }
}

export default billApi