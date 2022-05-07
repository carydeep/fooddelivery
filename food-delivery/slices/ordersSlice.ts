import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { Food, OrderUser } from '../models'
import userApi from '../pages/api/userApi'

export const getOrders = createAsyncThunk('order/getOrder', async (idUser: string) => {
    const currentOrder = await userApi.getUserInfo(idUser)
    return currentOrder.data.user_metadata?.orders
})

// Define a type for the slice state
interface OrderState {
    current: OrderUser | undefined
    loading: boolean,
    error: SerializedError
}

// Define the initial state using that type
const initialState: OrderState = {
    current: undefined,
    loading: false,
    error: {}
}

export const ordersSlice = createSlice({
    name: 'order',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        add: (state, action: PayloadAction<Food>) => {
            if (!state.loading) {
                const { id, image, price, name } = action.payload
                if (state.current === undefined) {
                    state.current = {
                        orderItems: [{
                            id: id,
                            img: image,
                            quantity: 1,
                            price: price,
                            name: name
                        }],
                        totalAmount: price
                    }
                } else {
                    const isAlreadyInArray = state.current.orderItems.filter(order => order.id === id).length > 0
                    if (isAlreadyInArray) {
                        const indexInArray = state.current.orderItems.findIndex(order => order.id === id)
                        state.current.orderItems[indexInArray].quantity += 1
                        state.current.orderItems[indexInArray].price += price
                        state.current.totalAmount += price
                    } else {
                        const newOrder = {
                            id: id,
                            img: image,
                            quantity: 1,
                            price: price,
                            name: name
                        }
                        state.current.orderItems.push(newOrder)
                        state.current.totalAmount += price
                    }
                }
            }
        },
        remove: (state, action: PayloadAction<Food>) => {
            if (!state.loading) {
                const { id, price } = action.payload
                if (state.current) {
                    const orderItems = state.current.orderItems
                    const findIndex = orderItems.map(orderItem => orderItem.id).indexOf(id)
                    if (findIndex > -1) {
                        if (orderItems[findIndex].quantity > 1) {
                            orderItems[findIndex].quantity -= 1
                            orderItems[findIndex].price -= price
                            state.current.totalAmount -= price
                        } else {
                            orderItems.splice(findIndex, 1)
                            state.current.totalAmount -= price
                        }
                    }
                }
            }
        },
        delete: (state, action: PayloadAction<Food>) => {
            if (!state.loading) {
                const { id, price } = action.payload
                if (state.current) {
                    const orderItems = state.current.orderItems
                    const findIndex = orderItems.map(orderItem => orderItem.id).indexOf(id)
                    if (findIndex > -1) {
                        state.current.totalAmount -= (price * state.current.orderItems[findIndex].quantity)
                        orderItems.splice(findIndex, 1)
                    }
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getOrders.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.error
            }),
            builder.addCase(getOrders.fulfilled, (state, action) => {
                state.loading = false
                state.current = action.payload
            })
    }
})

const { reducer: orderReducer } = ordersSlice

export default orderReducer