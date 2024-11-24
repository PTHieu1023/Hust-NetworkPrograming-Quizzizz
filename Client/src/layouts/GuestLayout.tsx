import { Link, Outlet } from 'react-router-dom'
import ThemePicker from '~/components/ThemePicker'
import ThemeToggle from '~/components/ThemeToggle'
import { APP_NAME } from '~/resources/common-constants'

const GuestLayout: React.FC = () => {
    return (
        <>
            <div className="navbar fixed top-0 bg-base-100 mx-2">
                <div className="flex-1">
                    <Link to={'/'} className="text-xl font-bold hover:opacity-75">
                        {APP_NAME}
                    </Link>
                </div>
                <div className="flex-none hidden md:block mr-2">
                    <ThemePicker />
                </div>
                <div className="flex-none md:hidden mr-2">
                    <ThemeToggle />
                </div>
            </div>
            <div className="min-h-screen flex justify-center items-center">
                <Outlet />
            </div>
        </>
    )
}

export default GuestLayout
