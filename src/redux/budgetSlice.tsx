


import { createSlice } from '@reduxjs/toolkit'

export interface budgetInterface {

    id: number,
    name: string,
    montant: number,
    start_montant: number,
    date: string,

}

export interface budgetState {
    budget: budgetInterface[],
    status: 'idle' | 'loading' | 'failed',
    error: string | null,
}

const initialState: budgetState = {
    budget: [],
    status: 'idle',
    error: null,
}

export const budgetSlice = createSlice({
    name: 'counter',
    initialState: initialState,
    reducers: {
        addBudget: (state, action) => {
            state.budget = (action.payload)
            state.status = 'loading'
        },
        setError: (state, action) => {
            state.error = action.payload
            state.status = 'failed'
        },
        clearBudget: (state) => {
            state.budget = []
            state.status = 'idle'
        }
    },
})

// Action creators are generated for each case reducer function
export const { addBudget, setError, clearBudget } = budgetSlice.actions

export default budgetSlice.reducer