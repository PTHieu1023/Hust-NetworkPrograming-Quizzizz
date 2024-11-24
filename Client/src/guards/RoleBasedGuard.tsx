import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~/contexts/AuthContext'
import { ROUTES } from '~/resources/routes-constants'

interface RoleBasedGuardProps {
    children: React.ReactNode
    accessibleRoles: string[] // Roles allowed to access this page
}

const RoleBasedGuard: React.FC<RoleBasedGuardProps> = ({ children, accessibleRoles }) => {
    const { state } = useAuth()
    const navigate = useNavigate()

    // Check if the user is authenticated and if their role is allowed
    useEffect(() => {
        if (!state.isAuthenticated || !state.user || !accessibleRoles.includes(state.user.role as string)) {
            navigate(ROUTES.FORBIDDEN_ROUTE, { replace: true }) // Replace ensures no back navigation to protected page
        }
    }, [state, accessibleRoles, navigate])

    return <>{children}</>
}

export default RoleBasedGuard
