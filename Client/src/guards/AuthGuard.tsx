import React from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import { useAppSelector } from '~/store/reducers/store'

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // const isAuthenticated = userService.isAuthenticated()
    const user = useAppSelector((state) => state.auth.user)

    // Redirect to login if the user is not authenticated
    // return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN_ROUTE} />
    return user ? <>{children}</> : <Navigate to={ROUTES.LOGIN_ROUTE} />
}

export default AuthGuard
