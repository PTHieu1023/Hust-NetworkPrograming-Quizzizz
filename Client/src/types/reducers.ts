import { Theme } from '~/resources/common-constants'
import { question, quizRoom, user } from './services'

export interface ReducerData {
    contents: string[]
}

export type ReduxActionData<T> = {
    type: any
    payload?: T
}

export type ReduxAction<T> = (data: T) => ReduxActionData<T>

export interface AuthState {
    user: user | null
    loading: boolean
    error: string | null
}

export interface ThemeState {
    mode: Theme
}

export interface quizQuestions {
    questionId: number
    roomId: number
    content: string
    answers: {
        answerId: number
        content: string
        isTrue?: boolean
    }[]
}

export interface QuizState {
    room: quizRoom | null
    questions: quizQuestions[]
    isStarted: boolean
    timeRemaining: number | null
    loading: boolean
    error: string | null
}
