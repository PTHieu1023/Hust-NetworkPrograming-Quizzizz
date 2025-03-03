import { createReducer } from '@reduxjs/toolkit'
import { themes } from '~/resources/common-constants'
import { ThemeState } from '~/types/reducers'
import { setTheme, toggleTheme } from '../actions/theme'

const initialState: ThemeState = {
    mode: 'light' // default theme
}

const themeReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(toggleTheme, (state) => {
            const nextTheme =
                themes[(themes.indexOf(state.mode) + 1) % themes.length]
            state.mode = nextTheme
        })
        .addCase(setTheme, (state, action) => {
            state.mode = action.payload
        })
})

export default themeReducer
