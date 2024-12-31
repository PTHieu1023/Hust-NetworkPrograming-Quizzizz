import React from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import { useAppSelector } from '~/store/reducers/store'

const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // const isAuthenticated = userService.isAuthenticated()
    const user = useAppSelector((state) => state.auth.user)

    // Redirect to the dashboard if the user is already authenticated
    // return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD_ROUTE} /> : <>{children}</>
    return user ? <Navigate to={ROUTES.DASHBOARD_ROUTE} /> : <>{children}</>
}

export default GuestGuard
