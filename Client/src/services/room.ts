import { quizQuestions } from '~/types/reducers'
import { Activity, quizRoom } from '~/types/services'
import userService from './user'
import WebSocketService from './webSocket'

type getRoomsDataInput = {
    name: string
    count?: number
    page?: number
}

class RoomService {
    private readonly GET_ROOM_QUESTIONS = 0x0005
    private readonly CREATE_ROOM_OPCODE = 0x0007
    private readonly GET_ROOMS_OPCODE = 0x0008
    private readonly DELETE_ROOM_OPCODE = 0x0009
    private readonly UPDATE_ROOM_OPCODE = 0x000a
    private readonly JOIN_ROOM_OPCODE = 0x000b
    private readonly GET_ROOM_RESULTS = 0x0011
    private readonly GET_ACTIVITIES = 0x0012
    private readonly ANSWER_QUESTION = 0x0013

    private ws = WebSocketService.getInstance()

    // Create a new room
    createRoom(data: quizRoom): Promise<quizRoom> {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.CREATE_ROOM_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.CREATE_ROOM_OPCODE)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to join room')
                const room: quizRoom = {
                    roomId: data?.roomId ?? 0,
                    host: {
                        userId: data?.hostId,
                        name: data?.hostName
                    },
                    name: data?.name ?? 'Quiz name',
                    code: data?.code ?? 0,
                    quizId: data?.testId ?? 0,
                    isPractice: data?.isPractice ?? false,
                    isPrivate: data?.isPrivate ?? false,
                    openedAt: data?.openedAt ?? '',
                    closedAt: data?.closedAt ?? ''
                }
                resolve(room)
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
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to get rooms')
                resolve(data)
            })
            this.ws.send(this.GET_ROOMS_OPCODE, {
                sessionId: userService.getToken(),
                ...data
            })
        })
    }

    // Get questions of a room
    getRoomQuestions(id: number, page: number): Promise<quizQuestions[]> {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.GET_ROOM_QUESTIONS, (data) => {
                this.ws.removeMessageHandler(this.GET_ROOM_QUESTIONS)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to get questions')
                resolve(data)
            })
            this.ws.send(this.GET_ROOM_QUESTIONS, {
                sessionId: userService.getToken(),
                roomId: id,
                page
            })
        })
    }

    // Join a room
    joinRoom(code: string): Promise<quizRoom> {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.JOIN_ROOM_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.JOIN_ROOM_OPCODE)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to join room')
                const room: quizRoom = {
                    roomId: data?.roomId ?? 0,
                    host: {
                        userId: data?.hostId,
                        name: data?.hostName
                    },
                    name: data?.name ?? 'Quiz name',
                    code: data?.code ?? 0,
                    quizId: data?.testId ?? 0,
                    isPractice: data?.isPractice ?? false,
                    isPrivate: data?.isPrivate ?? false,
                    openedAt: data?.openedAt ?? '',
                    closedAt: data?.closedAt ?? ''
                }
                console.log(room)
                resolve(room)
            })
            this.ws.send(this.JOIN_ROOM_OPCODE, {
                sessionId: userService.getToken(),
                code
            })
        })
    }

    // Update a room
    updateRoom(data: quizRoom) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.UPDATE_ROOM_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.UPDATE_ROOM_OPCODE)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to update room')
                resolve(data)
            })
            this.ws.send(this.UPDATE_ROOM_OPCODE, {
                sessionId: userService.getToken(),
                ...data
            })
        })
    }

    // Delete a room
    deleteRoom(roomId: number) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.DELETE_ROOM_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.DELETE_ROOM_OPCODE)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to delete room')
                resolve(data)
            })
            this.ws.send(this.DELETE_ROOM_OPCODE, {
                sessionId: userService.getToken(),
                roomId
            })
        })
    }

    // Get room results
    getRoomResults(roomId: number, page: number) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.GET_ROOM_RESULTS, (data) => {
                this.ws.removeMessageHandler(this.GET_ROOM_RESULTS)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to get room results')
                resolve(data)
            })
            this.ws.send(this.GET_ROOM_RESULTS, {
                sessionId: userService.getToken(),
                roomId,
                page
            })
        })
    }

    // Get room activities
    getActivities(page: number): Promise<Activity[]> {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.GET_ACTIVITIES, (data) => {
                this.ws.removeMessageHandler(this.GET_ACTIVITIES)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to get activities')
                resolve(data)
            })
            this.ws.send(this.GET_ACTIVITIES, {
                sessionId: userService.getToken(),
                page
            })
        })
    }

    // Submit answer
    submitAnswer(roomId: number, answerId: number) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.ANSWER_QUESTION, (data) => {
                this.ws.removeMessageHandler(this.ANSWER_QUESTION)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to get activities')
                resolve(data?.message)
            })
            this.ws.send(this.ANSWER_QUESTION, {
                sessionId: userService.getToken(),
                roomId,
                answerId
            })
        })
    }
}

const roomService = new RoomService()
export default roomService
