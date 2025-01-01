import {
    faClockRotateLeft,
    faGear,
    faHouse,
    faHouseChimney,
    faMagnifyingGlass,
    faRightFromBracket,
    faUser,
    faUsersRectangle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { APP_NAME } from '~/resources/common-constants'
import { ROUTES } from '~/resources/routes-constants'
import { logoutThunk } from '~/store/actions/auth'
import { useAppDispatch } from '~/store/reducers/store'
import ThemePicker from './ThemePicker'
import ThemeToggle from './ThemeToggle'

const Header: React.FC<{ tab: string; user: any }> = ({
    tab = 'home',
    user
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const dispatch = useAppDispatch()

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleLogout = () => {
        dispatch(logoutThunk())
    }

    return (
        <>
            <div className="fixed top-0 z-10 w-full shadow-md bg-base-100">
                <div className="navbar justify-between w-full">
                    <div className="md:flex gap-4 justify-start items-center hidden">
                        <Link
                            to="/"
                            className="text-lg font-bold hover:opacity-75 hidden lg:block px-4 text-primary"
                        >
                            {APP_NAME}
                        </Link>
                        <Link
                            to="/"
                            className="text-lg font-bold hover:opacity-75 lg:hidden px-4"
                        >
                            Logo
                        </Link>

                        <label className="input input-info flex items-center gap-2 h-10">
                            <input
                                type="text"
                                className="grow"
                                placeholder="Search"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </label>
                    </div>

                    <div className="md:hidden uppercase text-lg text-primary font-bold ml-2">
                        {tab}
                    </div>

                    <div className="flex justify-end gap-8">
                        <div className="md:flex items-center hidden">
                            <Link
                                to={`${ROUTES.DASHBOARD_ROUTE}?tab=home`}
                                className={`flex gap-2 items-center justify-center px-4 pb-5 -mb-5 cursor-pointer hover:opacity-75 hover:text-primary ${tab == 'home' && 'text-primary border-b-2 border-primary'}`}
                            >
                                <FontAwesomeIcon icon={faHouse} />
                                <span className="hidden lg:block">Home</span>
                            </Link>
                            <Link
                                to={`${ROUTES.DASHBOARD_ROUTE}?tab=activity`}
                                className={`flex gap-2 items-center justify-center px-4 pb-5 -mb-5 cursor-pointer hover:opacity-75 hover:text-primary ${tab == 'activity' && 'text-primary border-b-2 border-primary'}`}
                            >
                                <FontAwesomeIcon icon={faClockRotateLeft} />
                                <span className="hidden lg:block">
                                    Activity
                                </span>
                            </Link>
                            <Link
                                to={`${ROUTES.DASHBOARD_ROUTE}?tab=my-quiz`}
                                className={`flex gap-2 items-center justify-center px-4 pb-5 -mb-5 cursor-pointer hover:opacity-75 hover:text-primary ${tab == 'my-quiz' && 'text-primary border-b-2 border-primary'}`}
                            >
                                <FontAwesomeIcon icon={faUsersRectangle} />
                                <span className="hidden lg:block">My quiz</span>
                            </Link>
                        </div>

                        <div className="relative flex gap-2 justify-end items-center">
                            <ThemePicker className="hidden md:block" />
                            <ThemeToggle className="md:hidden" />
                            <label className="btn btn-circle btn-ghost swap swap-rotate">
                                <input
                                    type="checkbox"
                                    onClick={handleMenuToggle}
                                />

                                <svg
                                    className="swap-off fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 512 512"
                                >
                                    <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                                </svg>

                                <svg
                                    className="swap-on fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 512 512"
                                >
                                    <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                                </svg>
                            </label>
                            <div
                                className={`absolute top-full right-0 z-1 rounded-lg bg-base-100 w-48 shadow-md flex flex-col gap-2 p-4 transition-all origin-top-right duration-500 ease-in-out ${
                                    isMenuOpen
                                        ? 'opacity-100 scale-100 h-fit'
                                        : 'opacity-0 scale-50 pointer-events-none'
                                }`}
                            >
                                <div className="border-base-content/40 border-b-[1px] flex gap-2 items-center w-full p-2">
                                    <FontAwesomeIcon icon={faUser} />
                                    {user?.username ?? 'Unknown user'}
                                </div>
                                <Link
                                    to={ROUTES.PROFILE_ROUTE}
                                    className="flex gap-2 items-center w-full p-2 hover:bg-black/5"
                                >
                                    <FontAwesomeIcon icon={faGear} />
                                    Setting
                                </Link>
                                <button
                                    className="flex gap-2 items-center w-full p-2 hover:bg-black/5"
                                    onClick={handleLogout}
                                >
                                    <FontAwesomeIcon
                                        icon={faRightFromBracket}
                                    />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="md:hidden fixed z-20 bottom-12 w-full">
                <div className="mx-4 flex space-x-2 justify-around items-center rounded-full bg-base-100 shadow-lg h-16">
                    <Link
                        to={`${ROUTES.DASHBOARD_ROUTE}?tab=home`}
                        className="flex flex-col"
                    >
                        <FontAwesomeIcon icon={faHouseChimney} />
                        <span className="text-sm">Home</span>
                    </Link>
                    <Link
                        to={`${ROUTES.DASHBOARD_ROUTE}?tab=search`}
                        className="flex flex-col"
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <span className="text-sm">Search</span>
                    </Link>
                    <Link
                        to={`${ROUTES.DASHBOARD_ROUTE}?tab=activity`}
                        className="flex flex-col"
                    >
                        <FontAwesomeIcon icon={faClockRotateLeft} />
                        <span className="text-sm">Activity</span>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Header
