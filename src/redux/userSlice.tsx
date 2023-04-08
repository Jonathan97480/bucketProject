import { createSlice } from '@reduxjs/toolkit'

export interface user {
    id: number,
    identifiant: string,
    password: string,
}


export interface userInterface {

    user: user | undefined,
    isConnected: boolean
}

const initialState: userInterface = {
    user: undefined,
    isConnected: false
}


export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            state.isConnected = true

        },

        clearUser: (state) => {
            state = initialState

        }
    }

})


export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer

