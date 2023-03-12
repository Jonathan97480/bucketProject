import { createSlice } from '@reduxjs/toolkit'

export interface SimpleTransactionInterface {
    id: number,
    name: string,
    montant: number,
    montant_real: number,
    date: string,
    category: string,
    type: "income" | "expense",
}
export interface TransactionMonthInterface {
    id: number,
    name: string,
    montant: number,
    start_montant: number,
    montant_real: number,
    date: string,
    status: "unique" | "recurring",
    typeOperation: "income" | "expense",
    categoryID: number,
    period: "day" | "week" | "month" | "year" | null,
    transactionType: "Spent" | "Budget",
    transaction: {
        income: SimpleTransactionInterface[],
        expense: SimpleTransactionInterface[],
    } | null
}
export interface MonthInterface {
    numberTransactionMonth: number,
    nameMonth: string,
    AccountBalanceBeginningMonth: number,
    transactions: {
        income: TransactionMonthInterface[],
        expense: TransactionMonthInterface[],
    }
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
    discovered: boolean,
    discoveredMontant: 0,
    transactions: TransactionInterface[],


}

export interface comptesState {
    comptes: CompteInterface[],
    status: 'idle' | 'loading' | 'failed',
    currentCompte: CompteInterface | null,
    currentMonth: MonthInterface | null,
    error: string | null,
}

const initialState: comptesState = {
    comptes: [],
    status: 'idle',
    currentCompte: null,
    currentMonth: null,
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
        setCurentCompte: (state, action) => {
            state.currentCompte = action.payload
            state.status = 'loading'
        },

        setCurentMonth: (state, action) => {
            state.currentMonth = action.payload
            state.status = 'loading'
        },

        deleteCompteArray: (state, action) => {
            state.comptes = state.comptes.filter((compte) => compte.id !== action.payload)
            state.status = 'loading'

        }
    },
})

// Action creators are generated for each case reducer function
export const { addComptes, setError, setCurentCompte, setCurentMonth, clearComptes, addComptesArray, deleteCompteArray } = comptesSlice.actions

export default comptesSlice.reducer