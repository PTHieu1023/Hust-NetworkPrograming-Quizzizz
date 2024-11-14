import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import Routes from './routes/Router'
import { useAppSelector } from './store/reducers/store'

const RootComponent: React.FC = () => {
    const theme = useAppSelector((state) => state.themes.mode)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    return (
        <Router>
            <div className="h-screen overflow-y-scroll no-scrollbar">
                <Routes />
            </div>
        </Router>
    )
}

export default RootComponent
