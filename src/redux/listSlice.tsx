


import { createSlice } from '@reduxjs/toolkit'

export interface listInterface {

    id: number,
    name: string,
    montant: number,
    date: string,
    items: {
        id: number,
        name: string,
        montant: number,
        date: string,
        category: string,
        quantity: number,
        type: string,
        isChecked: boolean,
    }[],
    validate: boolean,
    task: number,
    taskTerminer: number,

}

export interface listState {
    list: listInterface[],
    status: 'idle' | 'loading' | 'failed',
    error: string | null,
}

const initialState: listState = {
    list: [],
    status: 'idle',
    error: null,
}

export const listSlice = createSlice({
    name: 'counter',
    initialState: initialState,
    reducers: {
        addList: (state, action) => {
            state.list = (action.payload)
            state.status = 'loading'
        },
        addListArray: (state, action) => {
            state.list.push(action.payload)
            state.status = 'loading'
        },
        setError: (state, action) => {
            state.error = action.payload
            state.status = 'failed'
        },
        clearList: (state) => {
            state.list = []
            state.status = 'idle'
        }
    },
})

// Action creators are generated for each case reducer function
export const { addList, setError, clearList, addListArray } = listSlice.actions

export default listSlice.reducer