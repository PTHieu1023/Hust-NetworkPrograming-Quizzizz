export type user = {
    id: number
    username: string
    name: string
    role?: string
}

export type question = {
    id: number
    question: string
    options?: string[]
}

export type quiz = {
    id: number
    name: string
    questions?: question[]
    isPrivate?: boolean
}

export type quizRoom = {
    id?: number
    host?: Omit<user, 'username'>
    name: string
    code?: string
    testId: string
    isPractice?: boolean
    isPrivate?: boolean
    openedAt?: number
    closedAt?: number
    players?: number[]
}
