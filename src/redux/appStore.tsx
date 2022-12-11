import { configureStore } from '@reduxjs/toolkit'
import listReducer from './listSlice'
import categoryReducer from './categorySlice'
import expendReducer from './expendSlice'


export const store = configureStore({
    reducer: {
        list: listReducer,
        category: categoryReducer,
        expend: expendReducer,
    },
})



