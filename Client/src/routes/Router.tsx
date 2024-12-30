import { useRoutes } from 'react-router-dom'
import AuthGuard from '~/guards/AuthGuard'
import GuestGuard from '~/guards/GuestGuard'
import AuthLayout from '~/layouts/AuthLayout'
import GuestLayout from '~/layouts/GuestLayout'
import QuizLayout from '~/layouts/QuizLayout'
import LoginPage from '~/pages/Auth/LoginPage'
import RegisterPage from '~/pages/Auth/RegisterPage'
import DashboardPage from '~/pages/DashboardPage'
import ForbiddenPage from '~/pages/Error/ForbiddenPage'
import NotFoundPage from '~/pages/Error/NotFoundPage'
import HomePage from '~/pages/HomePage'
import SetupPracticePage from '~/pages/Quiz/SetupPracticePage'
import { ROUTES } from '~/resources/routes-constants'

const Routes = () => {
    return useRoutes([
        {
            path: ROUTES.HOMEPAGE_ROUTE,
            element: <HomePage />
        },
        {
            element: (
                <GuestGuard>
                    <GuestLayout />
                </GuestGuard>
            ),
            children: [
                {
                    path: ROUTES.LOGIN_ROUTE,
                    element: <LoginPage />
                },
                {
                    path: ROUTES.REGISTER_ROUTE,
                    element: <RegisterPage />
                }
            ]
        },
        {
            element: (
                <AuthGuard>
                    <AuthLayout />
                </AuthGuard>
            ),
            children: [
                {
                    path: ROUTES.DASHBOARD_ROUTE,
                    element: <DashboardPage />
                }
            ]
        },
        {
            element: (
                <AuthGuard>
                    <QuizLayout />
                </AuthGuard>
            ),
            children: [
                {
                    path: `${ROUTES.QUIZ_ROUTE}/join/:mode`,
                    element: <SetupPracticePage />
                }
            ]
        },
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

export default Routes
