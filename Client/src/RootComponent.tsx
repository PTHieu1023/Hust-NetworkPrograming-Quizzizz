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
            <div className="h-screen overflow-y-scroll no-scrollbar">
                <ToastContainer />
                <Routes />
            </div>
        </Router>
    )
}

export default RootComponent
