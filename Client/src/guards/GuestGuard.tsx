import React from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import userService from '../services/user'

const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = userService.isAuthenticated()

    // Redirect to the dashboard if the user is already authenticated
    return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD_ROUTE} /> : <>{children}</>
}

export default GuestGuard
