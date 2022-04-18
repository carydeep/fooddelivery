import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { Food } from '../models'
import foodApi from '../pages/api/foodApi'

export const getFoods = createAsyncThunk('food/getFood', async () => {
    const currentFood = await foodApi.getFood()
    return currentFood
})

// Define a type for the slice state
interface FoodState {
    current: Food[]
    loading: boolean,
    error: SerializedError
}

// Define the initial state using that type
const initialState: FoodState = {
    current: [],
    loading: false,
    error: {}
}

export const foodsSlice = createSlice({
    name: 'food',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getFoods.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getFoods.rejected, (state, action) => {
                state.loading = false
                state.error = action.error
            }),
            builder.addCase(getFoods.fulfilled, (state, action) => {
                state.loading = false
                state.current = action.payload
            })
    }
})

const { reducer: foodReducer } = foodsSlice

export default foodReducer