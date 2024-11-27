import { Outlet } from 'react-router-dom'

const GuestLayout: React.FC = () => {
    return (
        <div className="h-full">
            <h1 className="text-center">This is the layout that do not require authentication</h1>
            <Outlet />
        </div>
    )
}

export default GuestLayout
