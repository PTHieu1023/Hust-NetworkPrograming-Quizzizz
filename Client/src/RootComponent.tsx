import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './animations.css'
import './index.css'
import Routes from './routes/Router'
import WebSocketService from './services/webSocket'
import { useAppSelector } from './store/reducers/store'

const RootComponent: React.FC = () => {
    const theme = useAppSelector((state) => state.theme.mode)

    useEffect(() => {
        const ws = WebSocketService.getInstance()

        ws.onMessage(1, (data) => {
            console.log('Received:', data)
        })

        // Cleanup
        return () => ws.removeHandler(1)
    }, [])

    const sendMessage = (message: string) => {
        WebSocketService.getInstance().send(1, { message })
    }

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
