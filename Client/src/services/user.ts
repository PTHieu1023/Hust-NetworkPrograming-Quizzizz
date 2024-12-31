import { AUTH_TOKEN } from '~/resources/common-constants'
import WebSocketService from './webSocket'
import { rejects } from 'assert'
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
    private readonly LOGIN_OPCODE = 0x0000
    private readonly REGISTER_OPCODE = 0x0001
    private readonly LOGOUT_OPCODE = 0x0002
    private readonly CHANGE_PASSWORD_OPCODE = 0x0003
    private readonly tokenKey = AUTH_TOKEN

    private ws = WebSocketService.getInstance()

    // Login a user
    login(credentials: LoginCredentials) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.LOGIN_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.LOGIN_OPCODE)
                // console.log(data)
                if (data?.session_id) {
                    this.saveToken(data.session_id)
                    resolve({ username: data.username, name: data.name })
                }
                rejects(data)
            })
            this.ws.send(this.LOGIN_OPCODE, credentials)
        })
    }

    // // Register a new user
    register(data: RegisterData) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.REGISTER_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.REGISTER_OPCODE)
                if (data?.message) resolve(data.message)
                rejects(data.err)
            })
            this.ws.send(this.REGISTER_OPCODE, data)
        })
    }

    // Logout the user
    logout() {
        this.ws.send(this.LOGOUT_OPCODE, { sessionId: this.getToken() })
        this.ws.removeMessageHandler(this.LOGOUT_OPCODE)
        this.clearToken()
    }

    // Change user password
    changePassword(currentPassword: string, newPassword: string) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.CHANGE_PASSWORD_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.CHANGE_PASSWORD_OPCODE)
                if (data?.message) resolve(data.message)
                rejects(data.err)
            })
            this.ws.send(this.CHANGE_PASSWORD_OPCODE, {
                sessionId: this.getToken(),
                currentPassword,
                newPassword,
                confirmPassword: newPassword
            })
        })
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
