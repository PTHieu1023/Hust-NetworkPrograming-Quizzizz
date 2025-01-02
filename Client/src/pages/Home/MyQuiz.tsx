import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import quizService from '~/services/quiz'
import { quiz } from '~/types/services'
import { notify } from '~/utility/functions'

const MyQuiz: React.FC = () => {
    const navigate = useNavigate()
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(false)

    const [quizzes, setQuizzes] = useState<quiz[]>([])

    const fetchQuizzes = async () => {
        try {
            setLoading(true)
            const response = await quizService.getQuizzes(totalPages + 1)
            if (response?.length) {
                // filter all quizzes that are includes in the response
                const filteredQuizzes = quizzes.filter(
                    (quiz) =>
                        !response.some((res) => res.quizId === quiz.quizId)
                )
                // add the new quizzes to the existing quizzes
                setQuizzes([...filteredQuizzes, ...response])
                setTotalPages(totalPages + 1)
                setLoading(false)
            }
        } catch (error: any) {
            console.error(error)
            notify('Fail to load quizzes', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuizzes()
    }, [])

    const handleLoadMore = async () => {
        await fetchQuizzes()
    }

    const handleCreateRom = (quiz: quiz, mode: string) => {
        navigate(`${ROUTES.QUIZ_ROUTE}/setup/${mode}`, { state: quiz })
    }

    return (
        <div className="flex flex-col justify-center items-center gap-4 min-h-[75vh]">
            {quizzes.map((quiz, index) => (
                <div
                    key={quiz.quizId || index}
                    className="flex flex-col justify-between items-center w-full bg-base-100/50 text-base-content p-4 gap-4 rounded-md shadow-md"
                >
                    <div>
                        <h3 className="text-lg font-bold">{quiz.name}</h3>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleCreateRom(quiz, 'practice')}
                            className="btn btn-accent w-28"
                        >
                            Practice
                        </button>
                        <button
                            onClick={() => handleCreateRom(quiz, 'play')}
                            className="btn btn-primary w-28"
                        >
                            Host
                        </button>
                        <button className="btn btn-outline w-28 btn-neutral">
                            Edit
                        </button>
                        <button className="btn btn-outline w-28 btn-error">
                            Delete
                        </button>
                    </div>
                </div>
            ))}

            {loading && (
                <span className="loading loading-spinner text-3xl text-primary"></span>
            )}

            <button
                onClick={handleLoadMore}
                disabled={loading}
                className="btn btn-secondary mt-4"
            >
                {loading ? 'Loading...' : 'Load More'}
            </button>
        </div>
    )
}

export default MyQuiz
