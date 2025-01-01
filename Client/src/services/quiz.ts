import { quiz } from '~/types/services'
import WebSocketService from './webSocket'
import userService from './user'

type createQuizDataInput = Omit<quiz, 'id'>
type getQuizzesDataInput = {
    name: string
    count?: number
    page?: number
}

class QuizService {
    private readonly CREATE_QUIZ_OPCODE = 0x0004

    private ws = WebSocketService.getInstance()

    // Create a new quiz
    createQuiz(data: createQuizDataInput) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.CREATE_QUIZ_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.CREATE_QUIZ_OPCODE)
                if (data?.status === 'Fail') rejects('Failed to create quiz')
                resolve(data)
            })
            this.ws.send(this.CREATE_QUIZ_OPCODE, {
                sessionId: userService.getToken(),
                ...data
            })
        })
    }

    // Get all quizzes
    getQuizzes(data: getQuizzesDataInput) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.CREATE_QUIZ_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.CREATE_QUIZ_OPCODE)
                if (data?.status === 'Fail') rejects('Failed to get quizzes')
                resolve(data)
            })
            this.ws.send(this.CREATE_QUIZ_OPCODE, {
                sessionId: userService.getToken(),
                ...data
            })
        })
    }
}

const quizService = new QuizService()
export default quizService
