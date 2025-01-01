import {
    faChevronRight,
    faUser,
    faUserPen
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '~/components/common/Modal'
import { changePassword, logoutThunk } from '~/store/actions/auth'
import { clearError } from '~/store/reducers/auth'
import { useAppDispatch, useAppSelector } from '~/store/reducers/store'
import { notify } from '~/utility/functions'

interface changePassword {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

const ProfilePage: React.FC = () => {
    const { user, error } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    const [showModal, setShowModal] = useState(false)

    const handleLogout = () => {
        dispatch(logoutThunk())
        notify('Logged out', 'success')
    }

    // Clear the error after 5 seconds
    useEffect(() => {
        if (error) {
            notify(error, 'error')
            const timer = setTimeout(() => {
                dispatch(clearError())
            }, 5000)

            // Clean up the timer on unmount or when error changes
            return () => clearTimeout(timer)
        }
    }, [error, dispatch])

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm<changePassword>()

    const password = watch('newPassword')

    const handleChangePassword = async (data: changePassword) => {
        dispatch(
            changePassword({ old: data.currentPassword, new: data.newPassword })
        )
        setShowModal(false)
    }

    return (
        <div className="flex justify-center max-w-7xl w-full h-full p-4">
            <div className="hero bg-base-100 rounded-md">
                <div className="hero-content gap-12 justify-between md:items-start flex-col md:flex-row-reverse max-w-3xl w-full">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                        className="max-w-sm rounded-lg shadow-2xl"
                    />
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col p-4">
                            <div className="flex items-center gap-2 my-2 text-xl">
                                <FontAwesomeIcon icon={faUserPen} />
                                <p>Profile</p>
                            </div>
                            <div className="flex flex-col relative p-2 cursor-pointer hover:text-warning">
                                <span>Username</span>
                                <span className="text-sm opacity-60">
                                    {user?.username}
                                </span>
                                <div className="absolute h-full right-0 flex justify-center items-center">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </div>
                            <div className="flex flex-col relative p-2 cursor-pointer hover:text-warning">
                                <span>Name</span>
                                <span className="text-sm opacity-60">
                                    {user?.name}
                                </span>
                                <div className="absolute h-full right-0 flex justify-center items-center">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-4">
                            <div className="flex items-center gap-2 my-2 text-xl">
                                <FontAwesomeIcon icon={faUser} />
                                <p>Account settings</p>
                            </div>
                            <button
                                className="flex justify-between items-center p-2 hover:text-warning"
                                onClick={() => setShowModal(true)}
                            >
                                <p>Change password</p>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                            <button className="flex justify-between items-center p-2 hover:text-warning">
                                <p>Delete account</p>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                            <button
                                className="p-2 hover:text-warning text-start"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                className="max-h-full"
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            >
                <form
                    className="flex flex-col gap-4 md:p-12 p-4"
                    onSubmit={handleSubmit(handleChangePassword)}
                >
                    <h2 className="text-xl">Change password</h2>
                    <label className="input input-bordered w-full flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70"
                        >
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <input
                            type="password"
                            className="grow"
                            placeholder="Current password"
                            aria-label="Current password"
                            {...register('currentPassword', {
                                required: 'Current password is required'
                            })}
                        />
                    </label>
                    {errors.currentPassword && (
                        <span className="text-xs text-error">
                            {errors.currentPassword.message}
                        </span>
                    )}

                    <label className="input input-bordered w-full flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70"
                        >
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <input
                            type="password"
                            className="grow"
                            placeholder="New password"
                            aria-label="New password"
                            {...register('newPassword', {
                                required: 'New password is required',
                                minLength: {
                                    value: 6,
                                    message:
                                        'Password must be at least 6 characters long'
                                }
                            })}
                        />
                    </label>
                    {errors.newPassword && (
                        <span className="text-xs text-error">
                            {errors.newPassword.message}
                        </span>
                    )}

                    <label className="input input-bordered w-full flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70"
                        >
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <input
                            type="password"
                            className="grow"
                            placeholder="Confirm password"
                            {...register('confirmPassword', {
                                required: 'Confirm Password is required',
                                validate: (value) =>
                                    value === password ||
                                    'Passwords do not match'
                            })}
                        />
                    </label>
                    {errors.confirmPassword && (
                        <span className="text-xs text-error">
                            {errors.confirmPassword.message}
                        </span>
                    )}

                    <button className="btn btn-primary w-full" type="submit">
                        Save
                    </button>
                </form>
            </Modal>
        </div>
    )
}

export default ProfilePage
