export type user = {
    userId?: number
    username: string
    name: string
    role?: string
}

export type question = {
    questionId?: number
    content: string
    answers?: { content: string; isTrue: boolean }[]
}

export type quiz = {
    quizId?: number
    name: string
    questions?: number[]
    isPrivate?: boolean
}

export type quizRoom = {
    roomId?: number
    host?: Omit<user, 'username'>
    name: string
    code?: string
    quizId: string
    isPractice?: boolean
    isPrivate?: boolean
    openedAt?: string
    closedAt?: string
    players?: number[]
}
