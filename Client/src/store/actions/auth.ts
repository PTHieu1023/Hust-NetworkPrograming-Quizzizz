import { createAsyncThunk } from '@reduxjs/toolkit'
import userService, { LoginCredentials, RegisterData } from '~/services/user'
import { logoutUser } from '../reducers/auth'

// Login User
export const loginUser = createAsyncThunk('auth/login', async (credentials: LoginCredentials, thunkAPI) => {
    try {
        const user = await userService.login(credentials)
        return user
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed')
    }
})

// Register User
export const registerUser = createAsyncThunk('auth/register', async (data: RegisterData, thunkAPI) => {
    try {
        await userService.register(data)
        return 'Registration successful'
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
})

// Logout User
export const logoutThunk = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        userService.logout() // Clear token
        thunkAPI.dispatch(logoutUser()) // Clear state
    } catch (error) {
        console.error('Logout failed:', error)
    }
})

// Refresh Token
export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, thunkAPI) => {
    try {
        const token = await userService.refreshToken()
        return token
    } catch (error: any) {
        return thunkAPI.rejectWithValue('Token refresh failed')
    }
})
