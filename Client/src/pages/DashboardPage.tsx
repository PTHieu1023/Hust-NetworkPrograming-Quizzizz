import { logoutThunk } from '~/store/actions/auth'
import { useAppDispatch } from '~/store/reducers/store'

const DashboardPage: React.FC = () => {
    const dispatch = useAppDispatch()
    const handleLogout = () => {
        dispatch(logoutThunk())
    }

    return (
        <div>
            <h1>DashboardPage</h1>
            <button className="btn btn-outline btn-primary" onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}

export default DashboardPage
