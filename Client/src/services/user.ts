import axios from 'axios'
import { AUTH_TOKEN, BASE_URL, TOKEN_EXPIRY } from '~/resources/common-constants'

const API_URL = `${BASE_URL}/api`

export interface LoginCredentials {
    username: string
    password: string
}

export interface RegisterData {
    email: string
    username: string
    password: string
}

class UserService {
    private tokenKey = AUTH_TOKEN
    private expiryKey = TOKEN_EXPIRY
    // Login a user
    async login(credentials: LoginCredentials) {
        const response = await axios.post(`${API_URL}/login`, credentials)
        console.log(response)
        const { user, token, expiresIn } = response.data
        this.saveToken(token, expiresIn)
        return user
    }

    // Register a new user
    async register(data: RegisterData) {
        const response = await axios.post(`${API_URL}/register`, data)
        return response.data
    }

    // Logout the user
    logout() {
        this.clearToken()
    }

    // Save token to localStorage
    private saveToken(token: string, expiresIn: number) {
        const expiry = new Date().getTime() + expiresIn * 1000
        localStorage.setItem(this.tokenKey, token)
        localStorage.setItem(this.expiryKey, expiry.toString())
    }

    // Clear token
    private clearToken() {
        localStorage.removeItem(this.tokenKey)
        localStorage.removeItem(this.expiryKey)
    }

    // Get token
    getToken(): string | null {
        const token = localStorage.getItem(this.tokenKey)
        const expiry = localStorage.getItem(this.expiryKey)

        if (token && expiry && Date.now() < parseInt(expiry, 10)) {
            return token // Token is valid
        } else {
            this.clearToken() // Token expired
            return null
        }
    }

    // Refresh token
    async refreshToken() {
        const response = await axios.post(`${API_URL}/refresh-token`, null, {
            headers: { Authorization: `Bearer ${this.getToken()}` }
        })
        const { token, expiresIn } = response.data
        this.saveToken(token, expiresIn)
        return token
    }

    // Check if the user is authenticated
    isAuthenticated(): boolean {
        return !!this.getToken()
    }
}

const userService = new UserService()
export default userService
