import { createReducer } from '@reduxjs/toolkit'
import { toggleTheme, setTheme } from '../actions/theme'
// Define the theme options
export const themes = [
    'light',
    'dark',
    'cupcake',
    'retro',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'luxury',
    'dracula',
    'lemonade',
    'night',
    'coffee',
    'winter'
] as const
export type Theme = (typeof themes)[number]

interface ThemeState {
    mode: Theme
}

const initialState: ThemeState = {
    mode: 'light' // default theme
}

const themeReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(toggleTheme, (state) => {
            const nextTheme = themes[(themes.indexOf(state.mode) + 1) % themes.length]
            state.mode = nextTheme
        })
        .addCase(setTheme, (state, action) => {
            state.mode = action.payload
        })
})

export default themeReducer
