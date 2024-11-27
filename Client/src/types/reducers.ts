import { Theme } from '~/resources/common-constants'
import { user } from './services'

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
    token: string | null
    loading: boolean
    error: string | null
}

export interface ThemeState {
    mode: Theme
}
