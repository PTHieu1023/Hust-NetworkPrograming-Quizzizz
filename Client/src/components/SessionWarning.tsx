import React from 'react'
import UserService from '~/services/user'
import { signOut } from '~/store/actions/auth'
import { useAppDispatch } from '~/store/reducers/store'

const SessionWarning: React.FC = () => {
    const dispatch = useAppDispatch()

    const handleLogout = async () => {
        UserService.logout()
        dispatch(signOut())
    }

    return (
        <div className="flex justify-center items-center w-full h-screen z-10 bg-black/5">
            <div className="flex flex-col justify-center items-center max-w-xl w-full py-4 mx-4 bg-base-100 text-base-content rounded-md shadow-md">
                <p className="my-2">Your session is about to expire. Please save your work.</p>
                <button className="btn btn-secondary" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default SessionWarning
