import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import UserService from '~/services/user'
import { signIn } from '~/store/actions/auth'
import { useAppDispatch } from '~/store/reducers/store'

const Login: React.FC = () => {
    const [data, setData] = useState({ username: 'testuser', password: 'password123' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null) // Reset error state on each submission attempt

        try {
            if (!data.username || !data.password) {
                throw new Error('Please fill in all fields')
            }
            const response = await UserService.login(data.username, data.password)
            if (!response.success) {
                throw new Error(response.message)
            }
            dispatch(signIn({ user: response.data }))
            navigate(ROUTES.DASHBOARD_ROUTE)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center w-full h-full">
            <div className="flex justify-center items-center max-w-xl w-full h-fit py-8 mx-4 bg-base-300 rounded-box shadow-xl">
                <div className="flex flex-col justify-center items-center gap-3 w-full max-w-80">
                    <h2 className="text-2xl text-primary">Welcome back!</h2>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <label className="input input-bordered w-full flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input
                            type="text"
                            className="grow"
                            placeholder="Username"
                            value={data.username}
                            onChange={(e) => {
                                setData({ ...data, username: e.target.value })
                                setError(null)
                            }}
                        />
                    </label>

                    <label className="input input-bordered w-full flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <input
                            type="password"
                            className="grow"
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => {
                                setData({ ...data, password: e.target.value })
                                setError(null)
                            }}
                        />
                    </label>

                    <div className="flex justify-between items-center w-full px-2">
                        <span className="text-info">Do not have an account?</span>
                        <Link to="/auth/register" className="text-primary hover:underline hover:opacity-50">
                            Register here
                        </Link>
                    </div>

                    <button className="btn btn-outline btn-success w-32 mt-4" onClick={handleLogin} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
