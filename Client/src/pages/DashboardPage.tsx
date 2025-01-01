import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Modal from '~/components/common/Modal'
import { ROUTES } from '~/resources/routes-constants'
import quizService from '~/services/quiz'
import roomService from '~/services/room'
import { quiz } from '~/types/services'
import { notify } from '~/utility/functions'

const DashboardPage: React.FC = () => {
    const [queryParams] = useSearchParams()
    const tab = queryParams.get('tab') ?? 'home'
    const navigate = useNavigate()

    const [quizzes, setQuizzes] = useState<quiz[]>([
        {
            id: 1,
            name: 'General Knowledge'
        },
        {
            id: 2,
            name: 'Science'
        },
        {
            id: 3,
            name: 'Mathematics'
        },
        {
            id: 4,
            name: 'History'
        },
        {
            id: 5,
            name: 'Geography'
        },
        {
            id: 6,
            name: 'Computer Science'
        }
    ])
    const featchQuizzes = async (name = '', count = 20, page = 1) => {
        try {
            // Fetch quizzes from the server
            const response = await quizService.getQuizzes({ name, count, page })
            setQuizzes(response as quiz[])
        } catch (error: any) {
            console.error(error)
            notify('Failed to fetch quizzes', 'error')
        }
    }
    useEffect(() => {
        featchQuizzes()
    }, [])

    const [code, setCode] = useState('')
    const [joiningRoom, setJoiningRoom] = useState(false)
    const handleJoinRoom = async () => {
        if (!code) {
            notify('Please enter a code', 'error')
            return
        }
        setJoiningRoom(true)
        try {
            // TODO
            // const response = await roomService.joinRoom(code)
            // console.log(response)
            const mockRoom = {
                id: 1,
                name: 'General Knowledge',
                testId: 1,
                code,
                startedAt: Date.now() + 3600000
            }
            navigate(`${ROUTES.QUIZ_ROUTE}/pre-game/${mockRoom.code}`, {
                state: mockRoom
            })
        } catch (error: any) {
            console.error(error)
            notify('Failed to join the room', 'error')
        } finally {
            setJoiningRoom(false)
        }
    }

    const [showModal, setShowModal] = useState(false)
    const [choosenQuiz, setChoosenQuiz] = useState<quiz>({
        id: 0,
        name: ''
    })
    const handleChooseQuiz = (quiz: quiz) => {
        setChoosenQuiz(quiz)
        setShowModal(true)
    }
    const handleCreateRom = (quiz: quiz, mode: string) => {
        // TODO
        navigate(`${ROUTES.QUIZ_ROUTE}/setup/${mode}`, { state: quiz })
    }

    return (
        <>
            {tab === 'home' && (
                <>
                    <div className="flex flex-col max-w-7xl w-full p-4">
                        <div className="flex flex-wrap w-full my-4">
                            <div className="md:w-2/3 w-full h-64 p-4">
                                <div className="flex lg:flex-row flex-col gap-4 items-center justify-center w-full h-full p-2 rounded-xl shadow-lg bg-base-100">
                                    <div className="relative h-12 w-full max-w-80 rounded-xl">
                                        <input
                                            type="number"
                                            placeholder="Enter a code to join"
                                            className="input input-primary input-bordered w-full h-full max-w-md"
                                            value={code}
                                            onChange={(e) => {
                                                setCode(e.target.value)
                                            }}
                                        />
                                        <button
                                            className="absolute inset-y-0 right-0 btn btn-primary w-20"
                                            onClick={handleJoinRoom}
                                            disabled={joiningRoom}
                                        >
                                            JOIN
                                        </button>
                                    </div>
                                    <Link
                                        to={`${ROUTES.QUIZ_ROUTE}/create`}
                                        className="btn btn-outline w-full max-w-80 lg:w-auto btn-success"
                                    >
                                        Make your own quiz
                                    </Link>
                                </div>
                            </div>
                            <div className="md:w-1/3 w-full h-64 p-4">
                                <div className="w-full h-full bg-gradient-to-r from-primary/10 to-primary/25 rounded-xl shadow-lg">
                                    {/* TODO */}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <div className="flex justify-between p-2">
                                <div className="flex items-center gap-2 text-xl">
                                    <FontAwesomeIcon
                                        icon={faStar}
                                        className="text-warning"
                                    />
                                    Category
                                </div>
                                <Link to={'/'} className="btn btn-outline">
                                    See more
                                </Link>
                            </div>
                            <div className="flex flex-wrap justify-around items-center">
                                {quizzes.map((quiz) => {
                                    if (quiz.isPrivate) return null
                                    return (
                                        <div
                                            key={quiz.id}
                                            className="lg:w-1/6 md:w-1/3 w-1/2 p-2"
                                        >
                                            <button
                                                className="h-48 w-full flex flex-col relative bg-base-100 rounded-lg shadow-md hover:shadow-xl cursor-pointer"
                                                onClick={() =>
                                                    handleChooseQuiz(quiz)
                                                }
                                            >
                                                <div className="h-3/5 w-full flex justify-center items-center overflow-hidden">
                                                    <div className="bg-gradient-to-tr from-neutral/25 to-neutral/50 w-full h-full rounded-t-lg "></div>
                                                </div>
                                                <div className="absolute inset-x-0 top-1/2 flex justify-between items-center mx-2">
                                                    <span className="text-xs border-[1px] p-[2px] rounded-md bg-base-100">{`${quiz.questions?.length ?? 10} Qs`}</span>
                                                    <span className="text-xs border-[1px] p-[2px] rounded-md bg-base-100">
                                                        100 plays
                                                    </span>
                                                </div>
                                                <div className="h-2/5 p-2 w-full overflow-hidden text-start text-ellipsis">
                                                    <span>{quiz.name}</span>
                                                </div>
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                    >
                        <div className="flex flex-col p-4">
                            <div className="flex flex-col py-4 gap-4">
                                <h1>{choosenQuiz.name}</h1>
                                <span>{`Total questions: ${choosenQuiz.questions?.length ?? 0}`}</span>
                            </div>
                            <div className="flex justify-center items-center gap-4">
                                <button
                                    className="btn btn-neutral w-40"
                                    onClick={() =>
                                        handleCreateRom(choosenQuiz, 'practice')
                                    }
                                >
                                    Practice
                                </button>
                                <button
                                    className="btn btn-accent w-40"
                                    onClick={() =>
                                        handleCreateRom(choosenQuiz, 'play')
                                    }
                                >
                                    Challenge friends
                                </button>
                            </div>
                        </div>
                    </Modal>
                </>
            )}

            {tab === 'activity' && (
                <div className="flex flex-col justify-center items-center gap-4 min-h-[75vh]">
                    <h1>There was no activities here</h1>
                </div>
            )}

            {tab === 'my-quiz' && (
                <div className="flex flex-col justify-center items-center gap-4 min-h-[75vh]">
                    <h1>You do not have any quiz</h1>
                    <Link
                        to={`${ROUTES.QUIZ_ROUTE}/create`}
                        className="btn btn-success"
                    >
                        Create a quiz
                    </Link>
                </div>
            )}
        </>
    )
}

export default DashboardPage
