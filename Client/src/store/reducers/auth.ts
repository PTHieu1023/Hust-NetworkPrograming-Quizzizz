import { createSlice } from '@reduxjs/toolkit'
import { loginUser, logoutThunk, registerUser, refreshToken } from '../actions/auth'
import { AuthState } from '~/types/reducers'

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null
            state.token = null
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // Logout
            .addCase(logoutThunk.fulfilled, (state) => {
                state.user = null
                state.token = null
            })

            // Refresh Token
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload
            })
            .addCase(refreshToken.rejected, (state) => {
                state.token = null
            })
    }
})

export const { logoutUser } = authSlice.actions
export default authSlice.reducer
