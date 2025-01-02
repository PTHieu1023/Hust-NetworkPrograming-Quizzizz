import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Modal from '~/components/common/Modal'
import { ROUTES } from '~/resources/routes-constants'
import quizService from '~/services/quiz'
import { useAppSelector } from '~/store/reducers/store'
import { quiz } from '~/types/services'
import { notify } from '~/utility/functions'
import ProceedGame from './ProceedGame'

const Home: React.FC = () => {
    const user = useAppSelector((state) => state.auth.user)
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

    const fetchQuizzes = async (name = '', count = 20, page = 1) => {
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
        fetchQuizzes()
    }, [])

    const [showModal, setShowModal] = useState(false)
    const [chosenQuiz, setChosenQuiz] = useState<quiz>({
        id: 0,
        name: ''
    })

    const handleChooseQuiz = (quiz: quiz) => {
        setChosenQuiz(quiz)
        setShowModal(true)
    }

    const handleCreateRom = (quiz: quiz, mode: string) => {
        navigate(`${ROUTES.QUIZ_ROUTE}/setup/${mode}`, { state: quiz })
    }

    return (
        <>
            <div className="flex flex-col max-w-7xl w-full p-4">
                <div className="flex flex-wrap w-full my-4">
                    <div className="md:w-2/3 w-full h-64 p-4">
                        <ProceedGame />
                    </div>
                    <div className="md:w-1/3 w-full h-64 p-4">
                        <div className="flex justify-between w-full h-full bg-gradient-to-r from-secondary/25 to-secondary/50 text-secondary-content rounded-xl shadow-lg">
                            <div className="text-3xl p-4">
                                <p>{`Hello, ${user?.name ?? 'user'}`}</p>
                            </div>
                            <img
                                src="/Snowman.svg"
                                alt="avatar"
                                className="object-cover h-full"
                            />
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
                                        className="h-48 w-full flex flex-col relative bg-base-100 bg-opacity-75 rounded-lg shadow-md hover:shadow-xl cursor-pointer"
                                        onClick={() => handleChooseQuiz(quiz)}
                                    >
                                        <div className="h-3/5 w-full flex justify-center items-center overflow-hidden">
                                            <div className="bg-gradient-to-tr from-accent/25 to-neutral/25 w-full h-full rounded-t-lg "></div>
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

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className="flex flex-col p-4">
                    <div className="flex flex-col py-4 gap-4">
                        <h1>{chosenQuiz.name}</h1>
                        <span>{`Total questions: ${chosenQuiz.questions?.length ?? 0}`}</span>
                    </div>
                    <div className="flex justify-center items-center gap-4">
                        <button
                            className="btn btn-neutral w-40"
                            onClick={() =>
                                handleCreateRom(chosenQuiz, 'practice')
                            }
                        >
                            Practice
                        </button>
                        <button
                            className="btn btn-accent w-40"
                            onClick={() => handleCreateRom(chosenQuiz, 'play')}
                        >
                            Challenge friends
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
export default Home