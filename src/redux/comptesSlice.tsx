import { createSlice } from '@reduxjs/toolkit'

export interface MonthInterface {
    numberTransactionMonth: number,
    nameMonth: string,
    transactions: {
        id: number,
        name: string,
        montant: number,
        start_montant: number,
        date: string,
        status: "unique" | "recurring",
        type: "income" | "expense",
        category: string,
        period: "day" | "week" | "month" | "year",
        transactionType: "simple" | "budget",
        transaction: {
            id: number,
            name: string,
            montant: number,
            date: string,
            category: string,
            type: "income" | "expense",
        }[]
    }[]
}

export interface TransactionInterface {

    year: number,
    numberTransactionYear: number,
    month: MonthInterface[]
}

export interface CompteInterface {

    id: number,
    name: string,
    pay: number,
    withdrawal: number,
    deposit: number,
    date: string,
    transactions: TransactionInterface[],


}

export interface comptesState {
    comptes: CompteInterface[],
    status: 'idle' | 'loading' | 'failed',
    currentCompte: CompteInterface | null,
    error: string | null,
}

const initialState: comptesState = {
    comptes: [],
    status: 'idle',
    currentCompte: null,
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
        setCUrentCompte: (state, action) => {
            state.currentCompte = action.payload
            state.status = 'loading'
        },



        deleteCompteArray: (state, action) => {
            state.comptes = state.comptes.filter((compte) => compte.id !== action.payload)
            state.status = 'loading'

        }
    },
})

// Action creators are generated for each case reducer function
export const { addComptes, setError, setCUrentCompte, clearComptes, addComptesArray, deleteCompteArray } = comptesSlice.actions

export default comptesSlice.reducer