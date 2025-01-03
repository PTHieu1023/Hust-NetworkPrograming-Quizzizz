import { createSlice } from '@reduxjs/toolkit'
import { QuizState } from '~/types/reducers'
import { getQuizQuestions, joinQuiz } from '../actions/quiz'
import { calculateTimeRemaining } from '~/utility/functions'

const initialState: QuizState = {
    room: null,
    questions: [],
    isStarted: false,
    timeRemaining: null,
    loading: false,
    error: null
}

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        // Add reducers here
        clearError: (state) => {
            state.error = null
            state.loading = false
        }
    },
    extraReducers: (builder) => {
        // Add extraReducers here
        builder
            // Join Quiz
            .addCase(joinQuiz.pending, (state) => {
                state.loading = true
            })
            .addCase(joinQuiz.fulfilled, (state, action) => {
                state.loading = false
                state.room = action.payload
            })
            .addCase(joinQuiz.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Get Quiz Questions
            .addCase(getQuizQuestions.pending, (state) => {
                state.loading = true
            })
            .addCase(getQuizQuestions.fulfilled, (state, action) => {
                state.loading = false
                state.questions = action.payload
                state.isStarted = true
                state.timeRemaining = calculateTimeRemaining(
                    state.room?.closedAt as string
                )
            })
            .addCase(getQuizQuestions.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export const { clearError } = quizSlice.actions
export default quizSlice.reducer
