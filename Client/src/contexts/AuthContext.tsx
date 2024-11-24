import { PayloadAction } from '@reduxjs/toolkit'
import React, { createContext, ReactNode, useEffect, useReducer, useState } from 'react'
import SessionWarning from '~/components/SessionWarning'
import { AUTH_TOKEN, SESSION_WARNING_TIME, TOKEN_EXPIRY } from '~/resources/common-constants'
import UserService from '~/services/user'
import { AuthState } from '~/types/reducers'
import { initializeAuth } from '../store/actions/auth'
import authReducer, { initialState } from '../store/reducers/auth'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'

interface AuthContextType {
    state: AuthState
    dispatch: React.Dispatch<PayloadAction<AuthState>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState)
    const [showSessionWarning, setShowSessionWarning] = useState(false)

    // Handle authentication state based on the token
    useEffect(() => {
        const checkAuthSession = async () => {
            const token = localStorage.getItem(AUTH_TOKEN)
            console.log('Token:', token)

            if (!token || UserService.isTokenExpired()) {
                console.log('Token not found or expired')
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
            // dispatch(initializeAuth({ isAuthenticated: true })) // For testing

            // const expiryTime = localStorage.getItem(TOKEN_EXPIRY)
            // const timeRemaining = Number(expiryTime) - Date.now()
            // const timeRemaining = 3 * 60 * 1000 // 3 minutes for testing

            // if (timeRemaining <= SESSION_WARNING_TIME) {
            //     setShowSessionWarning(true)
            // }

            // const timer = setTimeout(() => {
            //     setShowSessionWarning(false)
            //     dispatch(initializeAuth({ isAuthenticated: false })) // Logout after expiry
            // }, timeRemaining)

            // return () => clearTimeout(timer)
        }

        checkAuthSession()
    }, [])

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {state.isInitialized ? (
                <>
                    {showSessionWarning && <SessionWarning />}
                    {children}
                </>
            ) : (
                <div>Loading...</div>
            )}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
