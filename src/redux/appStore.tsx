import { configureStore } from '@reduxjs/toolkit'
import budgetReducer from './budgetSlice'
import categoryReducer from './categorySlice'
import expendReducer from './expendSlice'


export const store = configureStore({
    reducer: {
        budget: budgetReducer,
        category: categoryReducer,
        expend: expendReducer,
    },
})



