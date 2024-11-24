import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~/contexts/AuthContext'
import { ROUTES } from '~/resources/routes-constants'

interface GuestGuardProps {
    children: React.ReactNode
}

const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
    const { state } = useAuth()
    const navigate = useNavigate()

    // If the user is authenticated, redirect them to a different page (e.g., home or dashboard)
    useEffect(() => {
        if (state.isAuthenticated) {
            navigate(ROUTES.DASHBOARD_ROUTE, { replace: true })
        }
    }, [state.isAuthenticated, navigate])

    return <>{children}</>
}

export default GuestGuard
