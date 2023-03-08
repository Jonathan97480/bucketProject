import { createSlice } from '@reduxjs/toolkit'


export interface userInterface {

    id: number,
    identifiant: string,
    password: string,
    isConnected: boolean
}

const initialState: userInterface = {
    id: 0,
    identifiant: "",
    password: "",
    isConnected: false
}


export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            state = action.payload

        },

        clearUser: (state) => {
            state = initialState

        }
    }

})


export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer

