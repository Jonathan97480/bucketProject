
import { createSlice } from '@reduxjs/toolkit'


export interface listeExpendInterface {

    id: number,
    name: string,
    montant: number,
    montant_total: number,
    date: string,
    category: string,
    description: string,
    recurrence: number,
    type: string,
    quantity: number,


}

export interface PoleExpend {
    id: number,
    nom: string,
    montant: number,
    date: string,
    montantStart: number,
    isList: boolean,
    listeExpend: listeExpendInterface[]

}


export interface ExpendState {
    expends: PoleExpend[],
    status: 'idle' | 'loading' | 'failed',
    error: string | null,

}


const initialState: ExpendState = {
    expends: [],
    status: 'idle',
    error: null,
}

export const expendSlice = createSlice({
    name: 'expends',
    initialState: initialState,
    reducers: {
        addExpend: (state, action) => {

            state.expends = action.payload
            state.status = 'loading'
        },

        clearExpend: (state) => {
            state.expends = []
            state.status = 'idle'
            state.error = null
        },

        setError: (state, action) => {
            state.error = action.payload
            state.status = 'failed'
        },
    },
})


export const { addExpend, setError, clearExpend } = expendSlice.actions

export default expendSlice.reducer



