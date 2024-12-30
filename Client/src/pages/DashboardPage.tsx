import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Modal from '~/components/common/Modal'
import { ROUTES } from '~/resources/routes-constants'

interface Quiz {
    id: number
    category: string
    title: string
    numberOfQuestions: number
    numberOfPlays: number
}

const DashboardPage: React.FC = () => {
    const [queryParams] = useSearchParams()
    const tab = queryParams.get('tab') ?? 'home'
    const navigate = useNavigate()

    const [searchInput, setSearchInput] = useState('')
    const [quiz, setQuiz] = useState<Quiz>({
        id: 0,
        category: '',
        title: '',
        numberOfQuestions: 0,
        numberOfPlays: 0
    })

    const handleSearch = () => {
        console.log(searchInput)
        setSearchInput('')
    }

    const handleChooseQuiz = (quiz: Quiz) => {
        setQuiz(quiz)
        setShowModal(true)
    }

    const handlePractice = (quiz: Quiz) => {
        console.log('Practice:', quiz)
        // TODO: Implement practice
        navigate(`${ROUTES.QUIZ_ROUTE}/join/practice`)
    }

    const mockQuiz = [
        {
            id: 1,
            category: 'General Knowledge',
            title: 'Quiz Title',
            numberOfQuestions: 10,
            numberOfPlays: 100
        },
        {
            id: 2,
            category: 'General Knowledge',
            title: 'Quiz Title',
            numberOfQuestions: 10,
            numberOfPlays: 100
        },
        {
            id: 3,
            category: 'General Knowledge',
            title: 'Quiz Title',
            numberOfQuestions: 10,
            numberOfPlays: 100
        },
        {
            id: 4,
            category: 'General Knowledge',
            title: 'Quiz Title',
            numberOfQuestions: 10,
            numberOfPlays: 100
        },
        {
            id: 5,
            category: 'General Knowledge',
            title: 'Quiz Title',
            numberOfQuestions: 10,
            numberOfPlays: 100
        },
        {
            id: 6,
            category: 'General Knowledge',
            title: 'Quiz Title',
            numberOfQuestions: 10,
            numberOfPlays: 100
        }
    ]

    const [showModal, setShowModal] = useState(false)

    return (
        <>
            {tab == 'home' && (
                <>
                    <div className="flex flex-col items-center py-16 min-h-screen w-full bg-base-300">
                        <div className="flex flex-col max-w-7xl w-full p-4">
                            <div className="flex flex-wrap w-full my-4">
                                <div className="md:w-2/3 w-full h-64 p-4">
                                    <div className="flex lg:flex-row flex-col gap-4 items-center justify-center w-full h-full p-2 rounded-xl shadow-lg bg-base-100">
                                        <div className="relative h-12 w-full max-w-80 rounded-xl">
                                            <input
                                                type="text"
                                                placeholder="Enter a code to join"
                                                className="input input-primary input-bordered w-full h-full max-w-md"
                                                value={searchInput}
                                                onChange={(e) => {
                                                    setSearchInput(e.target.value)
                                                }}
                                            />
                                            <button className="absolute inset-y-0 right-0 btn btn-primary w-20" onClick={handleSearch}>
                                                JOIN
                                            </button>
                                        </div>
                                        <Link to={'/'} className="btn btn-outline w-full max-w-80 lg:w-auto btn-success">
                                            Make your own room
                                        </Link>
                                    </div>
                                </div>
                                <div className="md:w-1/3 w-full h-64 p-4">
                                    <div className="w-full h-full bg-gradient-to-r from-primary/10 to-primary/25 rounded-xl shadow-lg">{/* TODO */}</div>
                                </div>
                            </div>

                            <div className="flex flex-col w-full">
                                <div className="flex justify-between p-2">
                                    <div className="flex items-center gap-2 text-xl">
                                        <FontAwesomeIcon icon={faStar} className="text-warning" />
                                        Category
                                    </div>
                                    <Link to={'/'} className="btn btn-outline">
                                        See more
                                    </Link>
                                </div>
                                <div className="flex flex-wrap justify-around items-center">
                                    {mockQuiz.map((quiz) => (
                                        <div key={quiz.id} className="lg:w-1/6 md:w-1/3 w-1/2 p-2">
                                            <button
                                                className="h-48 w-full flex flex-col relative bg-base-100 rounded-lg shadow-md hover:shadow-xl cursor-pointer"
                                                onClick={() => handleChooseQuiz(quiz)}
                                            >
                                                <div className="h-3/5 w-full flex justify-center items-center overflow-hidden">
                                                    <div className="bg-gradient-to-tr from-neutral/25 to-neutral/50 w-full h-full rounded-t-lg "></div>
                                                </div>
                                                <div className="absolute inset-x-0 top-1/2 flex justify-between items-center mx-2">
                                                    <span className="text-xs border-[1px] p-[2px] rounded-md bg-base-100">{`${quiz.numberOfQuestions} Qs`}</span>
                                                    <span className="text-xs border-[1px] p-[2px] rounded-md bg-base-100">{`${quiz.numberOfPlays} plays`}</span>
                                                </div>
                                                <div className="h-2/5 p-2 w-full overflow-hidden text-start text-ellipsis">
                                                    <span>{quiz.title}</span>
                                                </div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                        <div className="flex flex-col p-4">
                            <h1>{quiz.title}</h1>
                            <p>{quiz.category}</p>
                            <p>{quiz.numberOfQuestions}</p>
                            <p>{quiz.numberOfPlays}</p>
                            <div className="flex justify-center items-center gap-4">
                                <button className="btn btn-neutral" onClick={() => handlePractice(quiz)}>
                                    Practice
                                </button>
                                <button className="btn btn-accent">Play</button>
                            </div>
                        </div>
                    </Modal>
                </>
            )}
        </>
    )
}

export default DashboardPage
