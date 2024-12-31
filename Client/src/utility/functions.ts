import { toast } from 'react-toastify'

export const notify = (message: string, status?: 'info' | 'success' | 'warning' | 'error') => {
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
