import { createAsyncThunk } from '@reduxjs/toolkit'
import roomService from '~/services/room'
import { notify } from '~/utility/functions'

export const joinQuiz = createAsyncThunk(
    'quiz/joinQuiz',
    async (code: string, thunkAPI) => {
        try {
            const response = await roomService.joinRoom(code)
            notify('Joined quiz', 'success')
            return response
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error?.err || 'Failed to join quiz')
        }
    }
)
