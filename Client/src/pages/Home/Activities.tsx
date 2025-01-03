import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import roomService from '~/services/room'
import { Activity } from '~/types/services'
import { notify } from '~/utility/functions'

const Activities: React.FC = () => {
    const navigate = useNavigate()
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(false)

    const [activities, setActivities] = useState<Activity[]>([])

    const fetchActivities = async (page: number) => {
        setLoading(true)
        try {
            const response = await roomService.getActivities(page)
            if (response?.length !== 0) {
                setActivities(response)
            }
        } catch (error: any) {
            console.log(error)
            notify('Fail to load activities', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchActivities(1)
    }, [])

    return (
        <div className="flex flex-col gap-4 justify-center items-center gap-4">
            <h1 className="text-2xl font-semibold">Activities</h1>
            <button
                className="btn btn-info"
                onClick={() => fetchActivities(totalPages + 1)}
            >
                Load activity
            </button>
            <div className="w-full h-[calc(100vh-4rem)] overflow-y-auto">
                {activities.map((activity, index) => (
                    <div
                        key={index}
                        className="flex flex-col gap-2 p-4 border-b"
                    >
                        <div className="flex justify-between">
                            <h2 className="font-semibold">{activity.name}</h2>
                            <span>{activity.completedAt}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Activities
