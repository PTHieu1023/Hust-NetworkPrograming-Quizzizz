import { Link } from 'react-router-dom'
import { APP_NAME } from '~/resources/common-constants'
import { ROUTES } from '~/resources/routes-constants'
import Navigation from './Navigation'
import ThemePicker from './ThemePicker'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <div className="fixed top-0 w-full flex flex-col">
            <div className="navbar justify-between w-full">
                <div>
                    <Link to="/" className="text-lg font-bold hover:opacity-75 hidden md:block px-4 text-primary">
                        {APP_NAME}
                    </Link>
                    <Link to="/" className="text-lg font-bold hover:opacity-75 md:hidden px-4">
                        Logo
                    </Link>

                    <div className="hidden lg:flex justify-start items-center gap-2">
                        <Navigation />
                    </div>
                </div>

                <div className="lg:flex justify-end gap-2 hidden">
                    <Link to={ROUTES.LOGIN_ROUTE} className="btn w-24">
                        Log in
                    </Link>
                    <Link to={ROUTES.REGISTER_ROUTE} className="btn btn-primary w-24 text-primary-content">
                        Sign up
                    </Link>
                    <ThemePicker />
                </div>
                <div className="flex justify-end gap-2 lg:hidden">
                    <ThemeToggle />
                    <label className="btn btn-circle swap swap-rotate">
                        <input type="checkbox" onClick={handleMenuToggle} />

                        <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                        </svg>

                        <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                        </svg>
                    </label>
                </div>
            </div>

            <div className={`flex flex-col h-80 bg-neutral transition-all duration-300 ${isMenuOpen ? '' : 'hidden'}`}>
                <ul className="menu bg-base-200 rounded-box w-56">
                    <li>
                        <a>Item 1</a>
                    </li>
                    <li>
                        <a>Item 2</a>
                    </li>
                    <li>
                        <a>Item 3</a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar
