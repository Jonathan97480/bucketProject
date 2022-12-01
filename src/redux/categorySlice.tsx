
import { createSlice } from '@reduxjs/toolkit'

export interface CategoryState {
    category: {
        id: number,
        name: string,
    }[],
    status: 'idle' | 'loading' | 'failed',
    error: string | null,

}


const initialState: CategoryState = {
    category: [],
    status: 'idle',
    error: null,
}

export const categorySlice = createSlice({
    name: 'category',
    initialState: initialState,
    reducers: {
        addCategory: (state, action) => {
            state.category.push(action.payload)
            state.status = 'loading'
        },
        setError: (state, action) => {
            state.error = action.payload
            state.status = 'failed'
        },
    },
})


export const { addCategory, setError } = categorySlice.actions

export default categorySlice.reducer



