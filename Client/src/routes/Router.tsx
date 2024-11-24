import { useRoutes } from 'react-router-dom'
import GuestLayout from '~/layouts/GuestLayout'
import Login from '~/pages/Auth/Login'
import Register from '~/pages/Auth/Register'
import HomePage from '~/pages/HomePage'
import NotFoundPage from '~/pages/Error/NotFoundPage'
import { ROUTES } from '~/resources/routes-constants'
import ForbiddenPage from '~/pages/Error/ForbiddenPage'
import GuestGuard from '~/guards/GuestGuard'
import AuthGuard from '~/guards/AuthGuard'
import Dashboard from '~/pages/Dashboard'

const Router: React.FC = () => {
    return useRoutes([
        // HomePage route, accessible to everyone
        {
            path: ROUTES.HOMEPAGE_ROUTE,
            element: <HomePage />
        },
        // Auth routes (Login, Register)
        {
            path: ROUTES.AUTH_ROUTE,
            element: (
                <GuestGuard>
                    <GuestLayout />
                </GuestGuard>
            ),
            children: [
                {
                    path: 'login',
                    element: <Login />
                },
                {
                    path: 'register',
                    element: <Register />
                }
            ]
        },
        // Protected routes (requires authentication)
        {
            path: ROUTES.DASHBOARD_ROUTE,
            element: (
                <AuthGuard>
                    <Dashboard />
                </AuthGuard>
            )
        },
        // error pages
        {
            path: ROUTES.FORBIDDEN_ROUTE,
            element: <ForbiddenPage />
        },
        {
            path: '*',
            element: <NotFoundPage />
        }
    ])
}

export default Router
