import { createAction } from '@reduxjs/toolkit'

export const initializeAuth = createAction<{ isAuthenticated: boolean; user?: any }>('auth/initialize')
export const signIn = createAction<{ user: any }>('auth/signIn')
export const signOut = createAction('auth/signOut')
