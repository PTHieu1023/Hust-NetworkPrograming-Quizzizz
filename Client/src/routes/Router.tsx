import { useRoutes } from 'react-router-dom'
import GuestLayout from '~/layouts/GuestLayout'
import Login from '~/pages/Auth/Login'
import Register from '~/pages/Auth/Register'
import HomePage from '~/pages/HomePage'
import NotFoundPage from '~/pages/NotFoundPage'
import { ROUTES } from '~/resources/routes-constants'

const Router: React.FC = () => {
    return useRoutes([
        {
            path: '*',
            element: <NotFoundPage />
        },
        {
            path: ROUTES.HOMEPAGE_ROUTE,
            element: <HomePage />
        },
        {
            path: ROUTES.AUTH_ROUTE,
            element: <GuestLayout />,
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
        }
    ])
}

export default Router
