import { createSlice } from '@reduxjs/toolkit'
import { AuthState } from '~/types/reducers'
import { changePassword, loginUser, logoutThunk, registerUser } from '../actions/auth'
import { user } from './../../types/services'

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null
            state.error = null
        },
        clearError: (state) => {
            state.error = null
            state.loading = false
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
                state.user = action.payload as user
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
            })

            // Change Password
            .addCase(changePassword.rejected, (state, action) => {
                state.error = action.payload as string
            })
    }
})

export const { logoutUser, clearError } = authSlice.actions
export default authSlice.reducer
