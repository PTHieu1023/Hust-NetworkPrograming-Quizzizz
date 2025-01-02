import { createSlice } from '@reduxjs/toolkit'
import { QuizState } from '~/types/reducers'
import { joinQuiz } from '../actions/quiz'

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
    }
})

export const { clearError } = quizSlice.actions
export default quizSlice.reducer
