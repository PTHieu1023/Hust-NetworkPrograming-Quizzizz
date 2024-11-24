import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~/contexts/AuthContext'
import { ROUTES } from '~/resources/routes-constants'

interface AuthGuardProps {
    children: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { state } = useAuth()
    const navigate = useNavigate()

    // If the user is not authenticated, redirect them to the login page
    useEffect(() => {
        if (!state.isAuthenticated) {
            navigate(`${ROUTES.AUTH_ROUTE}/login`, { replace: true })
        }
    }, [state.isAuthenticated, navigate])

    return <>{children}</>
}

export default AuthGuard
