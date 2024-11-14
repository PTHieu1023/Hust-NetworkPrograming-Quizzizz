export interface ReducerData {
    contents: string[]
}

export type ReduxActionData<T> = {
    type: any
    payload?: T
}

export type ReduxAction<T> = (data: T) => ReduxActionData<T>

export interface AuthState {
    isInitialized?: boolean
    isAuthenticated?: boolean
    user?: User | null
}

export type User = {
    id: string
    email: string
    name: string
    role: string
}
