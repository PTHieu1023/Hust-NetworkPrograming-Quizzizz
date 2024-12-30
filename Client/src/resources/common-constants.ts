export const APP_NAME = 'React App'
export const BASE_URL = 'http://localhost:5000'
export const AUTH_TOKEN = 'authToken'
export const TOKEN_EXPIRY = 'token_expiry'
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
