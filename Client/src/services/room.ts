import { quizRoom } from '~/types/services'
import userService from './user'
import WebSocketService from './webSocket'

type getRoomsDataInput = {
    name: string
    count?: number
    page?: number
}

class RoomService {
    private readonly CREATE_ROOM_OPCODE = 0x0007
    private readonly GET_ROOMS_OPCODE = 0x0008
    private readonly DELETE_ROOM_OPCODE = 0x0009
    private readonly UPDATE_ROOM_OPCODE = 0x000a
    private readonly JOIN_ROOM_OPCODE = 0x000b

    private ws = WebSocketService.getInstance()

    // Create a new room
    createRoom(data: quizRoom) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.CREATE_ROOM_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.CREATE_ROOM_OPCODE)
                if (data?.status === 'Fail') rejects('Failed to create room')
                resolve(data)
            })
            this.ws.send(this.CREATE_ROOM_OPCODE, {
                sessionId: userService.getToken(),
                ...data
            })
        })
    }

    // Get rooms
    getRooms(data: getRoomsDataInput) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.GET_ROOMS_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.GET_ROOMS_OPCODE)
                if (data?.status === 'Fail') rejects('Failed to get rooms')
                resolve(data)
            })
            this.ws.send(this.GET_ROOMS_OPCODE, {
                sessionId: userService.getToken(),
                ...data
            })
        })
    }

    // Join a room
    joinRoom(code: string): Promise<quizRoom> {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.JOIN_ROOM_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.JOIN_ROOM_OPCODE)
                if (data?.status === 'Fail') rejects('Failed to join room')
                const room: quizRoom = {
                    host: {
                        id: data?.hostId,
                        name: data?.hostName
                    },
                    name: data?.name ?? 'Quiz name',
                    code: data?.code ?? 0,
                    testId: data?.testId ?? 0,
                    isPractice: data?.isPractice ?? false,
                    isPrivate: data?.isPrivate ?? false,
                    openedAt: data?.openedAt ?? 0,
                    closedAt: data?.closedAt ?? 0
                }
                resolve(room)
            })
            this.ws.send(this.JOIN_ROOM_OPCODE, {
                sessionId: userService.getToken(),
                code
            })
        })
    }

    // Delete a room
    deleteRoom(id: string) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.DELETE_ROOM_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.DELETE_ROOM_OPCODE)
                if (data?.status === 'Fail') rejects('Failed to delete room')
                resolve(data)
            })
            this.ws.send(this.DELETE_ROOM_OPCODE, {
                sessionId: userService.getToken(),
                roomId: id
            })
        })
    }
}

const roomService = new RoomService()
export default roomService
