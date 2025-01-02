import { useAppSelector } from '~/store/reducers/store'
import { quiz } from '~/types/services'
import userService from './user'
import WebSocketService from './webSocket'

type createQuizDataInput = Omit<quiz, 'id'>
type getQuizzesDataInput = {
    name: string
    count?: number
    page?: number
}

class QuizService {
    private readonly CREATE_QUIZ_OPCODE = 0x0004
    private readonly GET_QUIZZES_OPCODE = 0x0006

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
                questions: data.questions?.map((question) => question.id),
                name: data.name,
                isPrivate: data.isPrivate
            })
        })
    }

    // Get all quizzes
    getQuizzes(data: getQuizzesDataInput): Promise<quiz[]> {
        return new Promise((resolve, rejects) => {
            this.ws.onMessage(this.GET_QUIZZES_OPCODE, (data) => {
                this.ws.removeMessageHandler(this.GET_QUIZZES_OPCODE)
                if (data?.status === 'Fail') rejects('Failed to get quizzes')
                resolve(data)
            })
            this.ws.send(this.GET_QUIZZES_OPCODE, {
                sessionId: userService.getToken(),
                authorId: useAppSelector((state) => state.auth.user?.id),
                ...data
            })
        })
    }
}

const quizService = new QuizService()
export default quizService
