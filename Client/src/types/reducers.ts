import { Theme, themes } from '~/resources/common-constants'
import { User } from './services'

export interface ReducerData {
    contents: string[]
}

export type ReduxActionData<T> = {
    type: any
    payload?: T
}

export type ReduxAction<T> = (data: T) => ReduxActionData<T>

// Theme
export interface ThemeState {
    mode: Theme
}
export interface AuthState {
    isInitialized: boolean
    isAuthenticated: boolean
    user: User | null
}
