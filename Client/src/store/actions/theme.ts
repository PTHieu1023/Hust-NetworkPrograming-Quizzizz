import { createAction } from '@reduxjs/toolkit'
import { Theme } from '~/resources/common-constants'

export const toggleTheme = createAction('theme/toggle')
export const setTheme = createAction<Theme>('theme/set')
