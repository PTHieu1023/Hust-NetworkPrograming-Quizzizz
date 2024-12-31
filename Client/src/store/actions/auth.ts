import { createAsyncThunk } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import userService, { LoginCredentials, RegisterData } from '~/services/user'
import { notify } from '~/utility/functions'
import { logoutUser } from '../reducers/auth'

// Login User
export const loginUser = createAsyncThunk('auth/login', async (credentials: LoginCredentials, thunkAPI) => {
    try {
        const user = await userService.login(credentials)
        console.log('User:', user)
        notify('Logged in', 'success')
        return user
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.err || 'Login failed')
    }
})

// Register User
export const registerUser = createAsyncThunk('auth/register', async (data: RegisterData, thunkAPI) => {
    try {
        await userService.register(data)
        notify('Registered successfully', 'success')
        const navigate = useNavigate()
        navigate(ROUTES.LOGIN_ROUTE)
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.err || 'Registration failed')
    }
})

// Logout User
export const logoutThunk = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        userService.logout()
        thunkAPI.dispatch(logoutUser())
    } catch (error) {
        console.error('Logout failed:', error)
    }
})

// Change Password
export const changePassword = createAsyncThunk('auth/changePassword', async (data: { old: string; new: string }, thunkAPI) => {
    try {
        await userService.changePassword(data.old, data.new)
        notify('Password changed successfully', 'success')
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.err || 'Password change failed')
    }
})
