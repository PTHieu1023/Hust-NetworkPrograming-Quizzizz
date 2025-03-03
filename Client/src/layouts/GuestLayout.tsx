import { Link, Outlet } from 'react-router-dom'
import ThemePicker from '~/components/ThemePicker'
import ThemeToggle from '~/components/ThemeToggle'
import { APP_NAME } from '~/resources/common-constants'
import { ROUTES } from '~/resources/routes-constants'

const GuestLayout: React.FC = () => {
    return (
        <div className="w-full h-full relative">
            <div className="sticky h-min z-5 top-0 flex-grow-0 flex-shrink-0">
                <div className="flex items-center justify-start flex-row flex-nowrap w-full shadow-lg bg-primary text-primary-content">
                    <div className="flex p-2 mx-auto items-center justify-between flex-row flex-nowrap w-full h-full">
                        <Link
                            to="/"
                            className="text-lg font-bold hover:opacity-75 hidden lg:block px-4"
                        >
                            {APP_NAME}
                        </Link>
                        <Link
                            to="/"
                            className="text-lg font-bold hover:opacity-75 lg:hidden px-4"
                        >
                            Logo
                        </Link>
                        <div className="flex gap-2 justify-start items-center">
                            <Link
                                to={ROUTES.REGISTER_ROUTE}
                                className="btn btn-secondary w-24"
                            >
                                Sign up
                            </Link>
                            <ThemePicker className="hidden lg:block" />
                            <ThemeToggle className="lg:hidden" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[calc(100vh-4rem)] w-full">
                <Outlet />
            </div>
        </div>
    )
}

export default GuestLayout
