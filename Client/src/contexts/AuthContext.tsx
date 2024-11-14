import { PayloadAction } from '@reduxjs/toolkit'
import React, { createContext, ReactNode, useEffect, useReducer } from 'react'
import UserService from '~/services/user'
import { AuthState } from '~/types/reducers'
import { initializeAuth } from '../store/actions/auth'
import authReducer, { initialState } from '../store/reducers/auth'

interface AuthContextType {
    state: AuthState
    dispatch: React.Dispatch<PayloadAction<AuthState>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    useEffect(() => {
        const checkAuthSession = async () => {
            const token = localStorage.getItem('authToken')

            if (!token) {
                dispatch(initializeAuth({ isAuthenticated: false }))
                return
            }

            try {
                const user = await UserService.getProfile(token)
                dispatch(initializeAuth({ isAuthenticated: true, user }))
            } catch (error) {
                console.error('Error fetching user profile:', error)
                dispatch(initializeAuth({ isAuthenticated: false }))
            }
        }

        checkAuthSession()
    }, [])

    return <AuthContext.Provider value={{ state, dispatch }}>{state.isInitialized ? children : <div>Loading...</div>}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
