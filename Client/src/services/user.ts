import axios from 'axios'
import { AUTH_TOKEN, BASE_URL, TOKEN_EXPIRY } from '~/resources/common-constants'

const api_base = BASE_URL + '/api'
const UserService = {
    async login(username: string, password: string) {
        const response = await axios.post(`${api_base}/login`, { username, password })
        const { status, message, data, token, expired_at } = response.data

        if (status === 'error') {
            return { success: false, message } // handle failure
        }

        // Store token and expiry time in localStorage
        const expiryTime = new Date(expired_at).getTime()
        localStorage.setItem(AUTH_TOKEN, token) // Store token for session management
        localStorage.setItem(TOKEN_EXPIRY, expiryTime.toString()) // Store expiry time

        return { success: true, data }
    },

    async register(email: string, username: string, password: string) {
        const response = await axios.post(`${api_base}/register`, { email, username, password })
        return response.data // Return user data or registration success message
    },

    logout() {
        localStorage.removeItem(AUTH_TOKEN) // Remove token from storage
        localStorage.removeItem(TOKEN_EXPIRY) // Remove expiry time from storage
    },

    async getProfile(token: string) {
        const response = await axios.get(`${api_base}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    },

    // Check if token is expired based on expiry timestamp
    isTokenExpired() {
        return false // For testing purposes
        const expiryTime = localStorage.getItem(TOKEN_EXPIRY)
        if (!expiryTime) return true
        return Date.now() > Number(expiryTime) // Check if current time is past expiry time
    }

    // Add other methods here, like updateProfile, deleteUser, etc.
}

export default UserService
