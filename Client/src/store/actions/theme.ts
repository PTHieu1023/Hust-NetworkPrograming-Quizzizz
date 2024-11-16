import { createAction } from '@reduxjs/toolkit'
import { Theme } from '../reducers/theme'

export const toggleTheme = createAction('theme/toggle')
export const setTheme = createAction<Theme>('theme/set')
