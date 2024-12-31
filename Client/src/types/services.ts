export type user = {
    id: string
    username: string
    name: string
    role?: string
}

export type question = {
    id: string
    question: string
    type?: string
    answers?: string[]
}

export type quizRoom = {
    id: string
    name: string
    host?: user
    players?: user[]
    questions?: question[]
    startedAt?: number
    endedAt?: number
    timeRemaining?: number
}
