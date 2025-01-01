export const APP_NAME = 'Quizz'
export const AUTH_TOKEN = 'authToken'
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
