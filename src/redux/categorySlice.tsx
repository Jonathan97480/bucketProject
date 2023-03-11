
import { createSlice } from '@reduxjs/toolkit'

export interface CategoryInterface {
    id: number,
    name: string,
}

export interface CategoryState {
    category: CategoryInterface[],
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
            state.category = action.payload
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



