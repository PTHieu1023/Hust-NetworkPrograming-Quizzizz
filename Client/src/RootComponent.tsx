import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './animations.css'
import './index.css'
import Routes from './routes/Router'
import { useAppSelector } from './store/reducers/store'

const RootComponent: React.FC = () => {
    const theme = useAppSelector((state) => state.theme.mode)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    return (
        <Router>
            <div className="relative h-screen overflow-y-scroll no-scrollbar ">
                <div className="absolute inset-0 -z-10 bg-[url('/logos/bg_image.jpg')] bg-cover bg-fixed bg-center bg-no-repeat pointer-events-none"></div>
                <div className="bg-gradient-to-r from-primary/25 via-transparent to-secondary/25 absolute inset-0 z-0">
                    <ToastContainer />
                    <Routes />
                </div>
            </div>
        </Router>
    )
}

export default RootComponent
