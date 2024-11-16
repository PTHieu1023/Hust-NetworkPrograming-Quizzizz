import { createReducer } from '@reduxjs/toolkit'
import { AuthState } from '~/types/reducers'
import { initializeAuth, signIn, signOut } from '../actions/auth'

export const initialState: AuthState = {
    isInitialized: false,
    isAuthenticated: false,
    user: null
}

const authReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(initializeAuth, (state, action) => {
            state.isInitialized = true
            state.isAuthenticated = action.payload.isAuthenticated ?? false
            state.user = action.payload.user || null
        })
        .addCase(signIn, (state, action) => {
            state.isAuthenticated = true
            state.user = action.payload.user
        })
        .addCase(signOut, (state) => {
            state.isAuthenticated = false
            state.user = null
        })
})

export default authReducer
