
import { createSlice } from '@reduxjs/toolkit'

export interface ExpendState {
    expend: {
        id: number,
        name: string,
        montant: number,
        date: string,
        category: string,

    }[],
    status: 'idle' | 'loading' | 'failed',
    error: string | null,

}


const initialState: ExpendState = {
    expend: [],
    status: 'idle',
    error: null,
}

export const expendSlice = createSlice({
    name: 'category',
    initialState: initialState,
    reducers: {
        addExpend: (state, action) => {
            state.expend.push(action.payload)
            state.status = 'loading'
        },
        setError: (state, action) => {
            state.error = action.payload
            state.status = 'failed'
        },
    },
})


export const { addExpend, setError } = expendSlice.actions

export default expendSlice.reducer



