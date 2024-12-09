import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const DashboardPage: React.FC = () => {
    const [queryParams] = useSearchParams()
    const tab = queryParams.get('tab') ?? 'home'

    const [searchInput, setSearchInput] = useState('')

    const handleSearch = () => {
        console.log(searchInput)
        setSearchInput('')
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
                                        <div className="flex justify-center items-center h-12 border-2 rounded-xl">
                                            <input
                                                type="text"
                                                placeholder="Enter a code to join"
                                                className="input w-full h-full max-w-sm"
                                                value={searchInput}
                                                onChange={(e) => {
                                                    setSearchInput(e.target.value)
                                                }}
                                            />
                                            <button className="btn btn-primary w-20 -my-1" onClick={handleSearch}>
                                                JOIN
                                            </button>
                                        </div>
                                        <Link to={'/'} className="btn btn-outline w-full max-w-[300px] lg:w-auto btn-success">
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
                                    <Link to={'/'} className="btn">
                                        See more
                                    </Link>
                                </div>
                                <div className="flex flex-wrap justify-around items-center">
                                    {mockQuiz.map((quiz) => (
                                        <div key={quiz.id} className="lg:w-1/6 md:w-1/3 w-1/2 p-2">
                                            <button
                                                className="h-48 w-full flex flex-col relative bg-base-100 rounded-lg shadow-md hover:shadow-xl cursor-pointer"
                                                onClick={() => {
                                                    setShowModal(true)
                                                }}
                                            >
                                                <div className="h-[60%] flex justify-center items-center overflow-hidden">
                                                    <div className="bg-gradient-to-tr from-neutral/25 to-neutral/50 w-full h-full rounded-lg">{/* TODO */}</div>
                                                </div>
                                                <div className="absolute z-10 inset-x-0 top-1/2 flex justify-between items-center mx-2">
                                                    <span className="text-xs border-[1px] p-[2px] rounded-md bg-base-100">{`${quiz.numberOfQuestions} Qs`}</span>
                                                    <span className="text-xs border-[1px] p-[2px] rounded-md bg-base-100">{`${quiz.numberOfPlays} plays`}</span>
                                                </div>
                                                <div className="h-[40%] p-2 overflow-hidden text-ellipsis">
                                                    <span>{quiz.title}</span>
                                                </div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </>
            )}
        </>
    )
}

export default DashboardPage
