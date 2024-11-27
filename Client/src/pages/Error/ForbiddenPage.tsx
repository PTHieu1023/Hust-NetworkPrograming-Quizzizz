import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../resources/routes-constants'

const ForbiddenPage: React.FC = () => {
    const navigate = useNavigate()

    /**
     * Call this function to redirect the user to the homepage.
     */
    const redirectToHomePage = () => {
        navigate(ROUTES.HOMEPAGE_ROUTE)
    }

    return (
        <div className="relative flex justify-center items-center flex-col w-full h-full">
            <h1 className="text-6xl">You do not have permission to access this page</h1>
            <span className="cursor-pointer btn btn-ghost m-2" onClick={() => redirectToHomePage()}>
                Homepage
            </span>
        </div>
    )
}

export default ForbiddenPage
