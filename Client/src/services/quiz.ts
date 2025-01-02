import { question, quiz } from '~/types/services'
import userService from './user'
import WebSocketService from './webSocket'
class QuizService {
    private readonly CREATE_QUIZ_OPCODE = 0x0004
    private readonly GET_QUIZZES_OPCODE = 0x0006

    private ws = WebSocketService.getInstance()

    // Create a new quiz
    createQuiz(data: quiz) {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.CREATE_QUIZ_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.CREATE_QUIZ_OPCODE)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to create quiz')
                resolve(data)
            })
            this.ws.send(this.CREATE_QUIZ_OPCODE, {
                sessionId: userService.getToken(),
                ...data
            })
        })
    }

    // Get all quizzes
    getQuizzes(page: number): Promise<quiz[]> {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.GET_QUIZZES_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.GET_QUIZZES_OPCODE)
                if (!data || data?.err || data?.status === 'Fail')
                    rejects('Failed to get quizzes')
                resolve(data)
            })
            this.ws.send(this.GET_QUIZZES_OPCODE, {
                sessionId: userService.getToken(),
                page
            })
        })
    }
}

const quizService = new QuizService()
export default quizService
