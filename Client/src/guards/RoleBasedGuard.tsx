import React from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import { useAppSelector } from '~/store/reducers/store'

interface RoleBasedGuardProps {
    roles: string[]
    children: React.ReactNode
}

const RoleBasedGuard: React.FC<RoleBasedGuardProps> = ({ roles, children }) => {
    const { user } = useAppSelector((state) => state.auth)

    // Check if the user has one of the allowed roles
    const hasAccess = user?.role && roles.includes(user.role)

    // Redirect to a forbidden page or dashboard if unauthorized
    return hasAccess ? (
        <>{children}</>
    ) : (
        <Navigate to={ROUTES.FORBIDDEN_ROUTE} />
    )
}

export default RoleBasedGuard
