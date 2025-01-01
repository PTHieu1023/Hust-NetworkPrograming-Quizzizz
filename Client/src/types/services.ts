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
    id: number
    name: string
    testId: string
    code?: string
    isPractice?: boolean
    isPrivate?: boolean
    host?: user
    players?: user[]
    startedAt?: number
    closedAt?: number
    timeRemaining?: number
}
