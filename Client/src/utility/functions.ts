import { toast } from 'react-toastify'

export const notify = (
    message: string,
    status?: 'info' | 'success' | 'warning' | 'error'
) => {
    if (status) {
        toast[status](message, {
            position: 'top-right'
        })
    } else {
        toast(message, {
            position: 'top-right'
        })
    }
}

export const formatToLocalDatetime = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

export function calculateTimeRemaining(endTime: string): number {
    const end = new Date(endTime).getTime()
    const now = new Date().getTime()
    const timeRemaining = end - now

    return timeRemaining
}
