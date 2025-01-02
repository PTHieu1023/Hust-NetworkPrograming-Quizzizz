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

export interface QuizState {
    room: quizRoom | null
    questions?: question[]
    isStarted: boolean
    timeRemaining: number | null
    loading: boolean
    error: string | null
}
