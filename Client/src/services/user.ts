import { AUTH_TOKEN } from '~/resources/common-constants'
import WebSocketService from './webSocket'
export interface LoginCredentials {
    username: string
    password: string
}

export interface RegisterData {
    email: string
    name: string
    username: string
    password: string
}

class UserService {
    private readonly LOGIN_OPCODE = 0x1234
    private readonly LOGOUT_OPCODE = 0x0000
    private readonly REGISTER_OPCODE = 0x0001
    private readonly tokenKey = AUTH_TOKEN
    // Login a user
    login(credentials: LoginCredentials) {
        return new Promise((resolve, reject) => {
            WebSocketService.getInstance().send(this.LOGIN_OPCODE, credentials)

            WebSocketService.getInstance().onMessage(this.LOGIN_OPCODE, (data) => {
                console.log('Login response:', data)
                if (data.token) {
                    this.saveToken(data.token)
                    resolve(data)
                } else {
                    reject(data)
                }
            })
        })
    }

    // // Register a new user
    register(data: RegisterData) {
        return new Promise((resolve, reject) => {
            WebSocketService.getInstance().send(this.REGISTER_OPCODE, data)

            WebSocketService.getInstance().onMessage(this.REGISTER_OPCODE, (data) => {
                console.log('Register response:', data)
                if (data.token) {
                    this.saveToken(data.token)
                    resolve(data)
                } else {
                    reject(data)
                }
            })
        })
    }

    // Logout the user
    logout() {
        WebSocketService.getInstance().send(this.LOGOUT_OPCODE, {})
        this.clearToken()
    }

    // Save token to localStorage
    private saveToken(token: string) {
        localStorage.setItem(this.tokenKey, token)
    }

    // Clear token
    private clearToken() {
        localStorage.removeItem(this.tokenKey)
    }

    // Get token
    getToken() {
        return localStorage.getItem(this.tokenKey)
    }

    // Check if the user is authenticated
    isAuthenticated(): boolean {
        return !!this.getToken()
    }
}

const userService = new UserService()
export default userService
