import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import Routes from './routes/Router'
import { useAppSelector } from './store/reducers/store'
import { useAuth } from './contexts/AuthContext'

const RootComponent: React.FC = () => {
    const theme = useAppSelector((state) => state.theme.mode)
    const { state } = useAuth()

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    useEffect(() => {
        console.log('Auth state:', state)
    }, [state])

    return (
        <Router>
            <div className="h-screen overflow-y-scroll no-scrollbar">
                <Routes />
            </div>
        </Router>
    )
}

export default RootComponent
