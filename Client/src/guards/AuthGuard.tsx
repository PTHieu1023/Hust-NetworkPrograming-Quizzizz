import React from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import userService from '../services/user'

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = userService.isAuthenticated()

    // Redirect to login if the user is not authenticated
    return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN_ROUTE} />
}

export default AuthGuard
