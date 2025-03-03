import { useState } from 'react'
import roomService from '~/services/room'
import { useAppSelector } from '~/store/reducers/store'
import { notify } from '~/utility/functions'

const ReviewQuizPage: React.FC = () => {
    const { room } = useAppSelector((state) => state.quiz)
    const [loading, setLoading] = useState(false)
    const handleViewResult = async () => {
        try {
            setLoading(true)
            const response = await roomService.getRoomResults(
                Number(room?.roomId),
                1
            )
            console.log(response)
        } catch (error: any) {
            console.error(error)
            notify('Fail to get result', 'error')
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="flex justify-center items-center w-full h-[calc(100vh-4rem)]">
            <button
                className="btn"
                onClick={handleViewResult}
                disabled={loading}
            >
                View result
            </button>
        </div>
    )
}

export default ReviewQuizPage
