import { useUser } from '@auth0/nextjs-auth0'
import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit'
import userApi from '../pages/api/userApi'

export const getUser = createAsyncThunk('user/getUser', async (userId: string) => {
    const resUser = await userApi.getUserInfo(userId)
    return resUser.data
})

// Define a type for the slice state
interface User {
    current: any
    loading: boolean,
    error: SerializedError
}

// Define the initial state using that type
const initialState: User = {
    current: [],
    loading: false,
    error: {}
}

export const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        update: (state, action: PayloadAction<any>) => {
            const current = state.current.user_metadata
            const { name, address, phoneNumber, instagram } = action.payload
            current.name = name
            current.address = address
            current.phoneNumber = phoneNumber
            current.instagram = instagram
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUser.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error
            }),
            builder.addCase(getUser.fulfilled, (state, action) => {
                state.loading = false
                state.current = action.payload
            })
    }
})

const { reducer: userReducer } = userSlice

export default userReducer