import { configureStore } from '@reduxjs/toolkit'
import listReducer from './listSlice'
import categoryReducer from './categorySlice'
import expendReducer from './expendSlice'
import comptesSlice from './comptesSlice'
import userSlice from './userSlice'


export const store = configureStore({
    reducer: {
        list: listReducer,
        category: categoryReducer,
        expend: expendReducer,
        compte: comptesSlice,
        user: userSlice
    },
})



