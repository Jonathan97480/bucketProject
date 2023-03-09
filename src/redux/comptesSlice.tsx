import { createSlice } from '@reduxjs/toolkit'


export interface CompteInterface {

    id: number,
    name: string,
    montant: number,
    date: string,


}

export interface comptesState {
    comptes: CompteInterface[],
    status: 'idle' | 'loading' | 'failed',
    error: string | null,
}

const initialState: comptesState = {
    comptes: [],
    status: 'idle',
    error: null,
}

export const comptesSlice = createSlice({
    name: 'comptes',
    initialState: initialState,
    reducers: {
        addComptes: (state, action) => {
            state.comptes = (action.payload)
            state.status = 'loading'
        },
        addComptesArray: (state, action) => {
            state.comptes.push(action.payload)
            state.status = 'loading'
        },
        setError: (state, action) => {
            state.error = action.payload
            state.status = 'failed'
        },
        clearComptes: (state) => {
            state.comptes = []
            state.status = 'idle'
        },

        deleteCompteArray: (state, action) => {
            state.comptes = state.comptes.filter((compte) => compte.id !== action.payload)
            state.status = 'loading'

        }
    },
})

// Action creators are generated for each case reducer function
export const { addComptes, setError, clearComptes, addComptesArray, deleteCompteArray } = comptesSlice.actions

export default comptesSlice.reducer