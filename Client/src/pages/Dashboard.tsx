import { useNavigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import UserService from '~/services/user'
import { signOut } from '~/store/actions/auth'
import { useAppDispatch } from '~/store/reducers/store'

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        UserService.logout()
        dispatch(signOut())
        navigate(`${ROUTES.AUTH_ROUTE}/login`, { replace: true })
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <button className="btn btn-ghost" onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}

export default Dashboard
