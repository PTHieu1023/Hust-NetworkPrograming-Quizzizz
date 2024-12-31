import { faChevronRight, faUser, faUserPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import Modal from '~/components/common/Modal'
import { changePassword, logoutThunk } from '~/store/actions/auth'
import { useAppDispatch, useAppSelector } from '~/store/reducers/store'
import { notify } from '~/utility/functions'

const ProfilePage: React.FC = () => {
    const user = useAppSelector((state) => state.auth.user)
    const dispatch = useAppDispatch()
    const [showModal, setShowModal] = useState(false)
    const [password, setPassword] = useState({ old: '', new: '' })

    const handleLogout = () => {
        dispatch(logoutThunk())
        notify('Logged out', 'success')
    }

    const handleChangePassword = () => {
        dispatch(changePassword(password))
        setShowModal(false)
    }

    return (
        <div className="flex justify-center max-w-7xl w-full h-full p-4">
            <div className="hero bg-base-100 rounded-md">
                <div className="hero-content gap-12 justify-between md:items-start flex-col md:flex-row-reverse max-w-3xl w-full">
                    <img src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp" className="max-w-sm rounded-lg shadow-2xl" />
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col p-4">
                            <div className="flex items-center gap-2 my-2 text-xl">
                                <FontAwesomeIcon icon={faUserPen} />
                                <p>Profile</p>
                            </div>
                            <div className="flex flex-col relative p-2 cursor-pointer hover:text-warning">
                                <span>Username</span>
                                <span className="text-sm opacity-60">{user?.username}</span>
                                <div className="absolute h-full right-0 flex justify-center items-center">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </div>
                            <div className="flex flex-col relative p-2 cursor-pointer hover:text-warning">
                                <span>Name</span>
                                <span className="text-sm opacity-60">{user?.name}</span>
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
                            <button className="flex justify-between items-center p-2 hover:text-warning" onClick={() => setShowModal(true)}>
                                <p>Change password</p>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                            <button className="flex justify-between items-center p-2 hover:text-warning">
                                <p>Delete account</p>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                            <button className="p-2 hover:text-warning text-start" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className="flex flex-col gap-4 md:p-12 p-4">
                    <h2 className="text-xl">Change password</h2>
                    <label className="input input-bordered w-full flex items-center gap-2">
                        <input
                            type="password"
                            className="grow"
                            placeholder="Current password"
                            aria-label="Current password"
                            value={password.old}
                            onChange={(e) => setPassword({ ...password, old: e.target.value })}
                        />
                    </label>
                    <label className="input input-bordered w-full flex items-center gap-2">
                        <input
                            type="password"
                            className="grow"
                            placeholder="New password"
                            aria-label="New password"
                            value={password.new}
                            onChange={(e) => setPassword({ ...password, new: e.target.value })}
                        />
                    </label>
                    <button className="btn btn-primary w-full" onClick={handleChangePassword}>
                        Save
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default ProfilePage
