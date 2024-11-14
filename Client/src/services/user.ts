import axios from 'axios'
import { BASE_URL } from '~/resources/common-constants'

const api_base = BASE_URL + '/api'
const UserService = {
    async login(username: string, password: string) {
        // console.log(username, password)
        const response = await axios.post(`${api_base}/login`, { username, password })
        const { token, user } = response.data
        localStorage.setItem('authToken', token) // Store token for session management
        return user
    },

    async register(username: string, password: string) {
        const response = await axios.post(`${api_base}/register`, { username, password })
        return response.data // Return user data or registration success message
    },

    logout() {
        localStorage.removeItem('authToken') // Remove token from storage
    },

    async getProfile(token: string) {
        const response = await axios.get(`${api_base}/user-profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    }

    // Add other methods here, like updateProfile, deleteUser, etc.
}

export default UserService
