import axiosBackup from "./axiosBackup"

const billApi = {
    createBill:(userID:string,name:string,price:number,methodPayment:string,order:any)=>{
        const url = "/api/bill/post"
        const body = {
            userID,name,price,methodPayment,order
        }
        return axiosBackup.post(url,body)
    },
    getBillByUser:(userID:string)=>{
        const url = `/api/bill/get`
        const body = {
            iduser:userID
        }
        return axiosBackup.post(url,body)
    },
    backupOrder:(userID:string,order:any)=>{
        const url = `/api/order/post`
        const body={
            userID,
            order
        }
        return axiosBackup.post(url,body)
    }
}

export default billApi