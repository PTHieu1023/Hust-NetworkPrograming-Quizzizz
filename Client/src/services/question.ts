import { question } from '~/types/services'
import WebSocketService from './webSocket'
import userService from './user'

class QuestionService {
    private readonly CREATE_QUESTION_OPCODE = 0x000c
    private readonly GET_QUESTIONS_OPCODE = 0x000d
    private readonly UPDATE_QUESTION_OPCODE = 0x000e
    private readonly DELETE_QUESTION_OPCODE = 0x000f
    private readonly GET_QUESTION_OPCODE = 0x0010

    private ws = WebSocketService.getInstance()

    // Create a question
    createQuestion(data: question): Promise<question> {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.CREATE_QUESTION_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.CREATE_QUESTION_OPCODE)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to create question')
                resolve(data)
            })
            this.ws.send(this.CREATE_QUESTION_OPCODE, {
                sessionId: userService.getToken(),
                ...data
            })
        })
    }

    // Get all questions
    getQuestions(page = 1): Promise<question[]> {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.GET_QUESTIONS_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.GET_QUESTIONS_OPCODE)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to get questions')
                resolve(data)
            })
            this.ws.send(this.GET_QUESTIONS_OPCODE, {
                sessionId: userService.getToken(),
                page
            })
        })
    }

    // Update a question
    updateQuestion(data: question) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.UPDATE_QUESTION_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.UPDATE_QUESTION_OPCODE)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to update question')
                resolve(data)
            })
            this.ws.send(this.UPDATE_QUESTION_OPCODE, {
                sessionId: userService.getToken(),
                ...data
            })
        })
    }

    // Delete a question
    deleteQuestion(id: number) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.DELETE_QUESTION_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.DELETE_QUESTION_OPCODE)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to delete question')
                resolve(data)
            })
            this.ws.send(this.DELETE_QUESTION_OPCODE, {
                sessionId: userService.getToken(),
                questionId: id
            })
        })
    }

    // Get a question
    getQuestion(id: number): Promise<question> {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.GET_QUESTION_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.GET_QUESTION_OPCODE)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to get question')
                resolve(data)
            })
            this.ws.send(this.GET_QUESTION_OPCODE, {
                sessionId: userService.getToken(),
                questionId: id
            })
        })
    }
}

const questionService = new QuestionService()
export default questionService
