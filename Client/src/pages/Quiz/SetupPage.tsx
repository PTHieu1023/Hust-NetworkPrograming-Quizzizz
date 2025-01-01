import {
    faClock,
    faFaceGrinTears,
    faLock,
    faPlay,
    faShareNodes
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import { quizRoom } from '~/types/services'
import { notify } from '~/utility/functions'

const SetupPage: React.FC = () => {
    const { mode } = useParams()
    const quiz = useLocation().state

    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Omit<quizRoom, 'id'>>()

    const [loading, setLoading] = useState(false)
    const handleCreateRoom = async (data: Omit<quizRoom, 'id'>) => {
        data.isPractice = mode === 'practice'
        console.log(data)
        setLoading(true)
        try {
            // TODO
            // const response = await roomService.createRoom(data)
            // console.log(response)
            const mockRoom = {
                id: 1,
                name: 'General Knowledge',
                testId: 1,
                code: 123456,
                startedAt: Date.now() + 600000
            }
            navigate(`${ROUTES.QUIZ_ROUTE}/game/${mockRoom.code}`, {
                state: mockRoom
            })
        } catch (error) {
            console.error(error)
            notify('Failed to create room', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-wrap justify-center max-w-5xl w-full p-4">
            <div className="w-full md:w-2/5 p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col justify-around items-center min-h-64 py-4 px-8 rounded-lg bg-base-100">
                        <div className="flex gap-2 w-full">
                            <div className="bg-neutral rounded-md p-2 aspect-square max-w-32">
                                <span className="text-neutral-content">
                                    Quiz img
                                </span>
                            </div>
                            <div className="text-base-content">
                                <h1 className="text-xl md:text-3xl">
                                    {quiz.name}
                                </h1>
                                <span>
                                    {`${quiz.questions?.length ?? 10} questions`}
                                </span>
                            </div>
                        </div>
                        <span className="btn flex items-center justify-center w-full">
                            <FontAwesomeIcon icon={faShareNodes} />
                            Share
                        </span>
                    </div>
                    <div className="flex flex-col min-h-40 p-8 rounded-lg bg-base-100">
                        <span className="mb-4">Recent activity</span>
                        <span className="ml-4 opacity-50">
                            No activity found
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-3/5 p-4">
                <div className="flex justify-center min-h-64 p-8 rounded-lg bg-base-100">
                    <form
                        className="flex flex-col gap-4 justify-center items-center w-full max-w-96"
                        onSubmit={handleSubmit(handleCreateRoom)}
                    >
                        {mode === 'play' && (
                            <div className="flex flex-col gap-2 justify-center w-full">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Enter room name"
                                    className="input input-bordered w-full "
                                    {...register('name', {
                                        required: 'Room name is required'
                                    })}
                                />
                                {errors.name && (
                                    <span className="text-error text-xs">
                                        {errors.name.message}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="flex flex-col justify-center items-center w-full">
                            <span className="text-left w-full mb-4">
                                Settings
                            </span>
                            <div className="form-control w-full sm:px-4">
                                <label className="label flex-col gap-4 cursor-pointer">
                                    <span className="flex gap-2 items-center w-full">
                                        <FontAwesomeIcon
                                            className="w-6"
                                            icon={faClock}
                                        />
                                        Timer
                                    </span>
                                    <div className="w-full">
                                        <input
                                            type="range"
                                            min={0}
                                            defaultValue={15}
                                            max="60"
                                            className="range range-secondary"
                                            step="15"
                                        />
                                        <div className="flex w-full justify-between px-4 text-xs">
                                            {['0', '15', '30', '45', '60'].map(
                                                (value) => (
                                                    <div
                                                        key={value}
                                                        className="flex flex-col justify-center items-center"
                                                    >
                                                        <span>|</span>
                                                        <span>{value}</span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div className="form-control w-full sm:px-4">
                                <label className="label cursor-pointer">
                                    <span className="flex gap-2 items-center">
                                        <FontAwesomeIcon
                                            className="w-6"
                                            icon={faLock}
                                        />
                                        Private
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-accent"
                                        defaultChecked
                                        {...register('isPrivate')}
                                    />
                                </label>
                            </div>
                            <div className="form-control w-full sm:px-4">
                                <label className="label cursor-pointer">
                                    <span className="flex gap-2 items-center">
                                        <FontAwesomeIcon
                                            className="w-6"
                                            icon={faFaceGrinTears}
                                        />
                                        Memes
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-accent"
                                    />
                                </label>
                            </div>
                        </div>
                        <button
                            className="btn btn-accent flex items-center justify-center w-full"
                            type="submit"
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faPlay} />
                            {loading ? 'Creating room...' : 'Create room'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SetupPage
