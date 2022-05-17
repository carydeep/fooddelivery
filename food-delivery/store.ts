import {
    Action,
    configureStore,
    ThunkAction,
} from '@reduxjs/toolkit';
import foodReducer from './slices/foodSlice';
import orderReducer from './slices/ordersSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        order: orderReducer,
        food: foodReducer,
        userInfo: userReducer
        // This is where we add reducers.
        // Since we don't have any yet, leave this empty
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;