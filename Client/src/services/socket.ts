import { io, Socket } from 'socket.io-client'
import { BASE_URL } from '~/resources/common-constants'

let socket: Socket | null = null

export const connectSocket = (token: string) => {
    if (!socket) {
        socket = io(BASE_URL, {
            auth: { token }
        })
    }
    return socket
}

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}

export const getSocket = () => socket
