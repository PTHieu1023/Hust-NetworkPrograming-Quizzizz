import {
    faChevronLeft,
    faChevronRight,
    faPenToSquare,
    faTrashCan
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import questionService from '~/services/question'
import { question } from '~/types/services'
import { notify } from '~/utility/functions'

const ListQuestionsPage: React.FC = () => {
    const navigate = useNavigate()
    const [questions, setQuestions] = useState<question[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const questionsPerPage = 5
    const [totalPages, setTotalPages] = useState(0)
    const startIndex = (currentPage - 1) * questionsPerPage
    const displayedQuestions = questions.slice(
        startIndex,
        startIndex + questionsPerPage
    )

    const [loading, setLoading] = useState(false)

    const fetchQuestions = async (page = 1) => {
        try {
            setLoading(true)
            const response = await questionService.getQuestions(page)
            if (response?.length !== 0) {
                // filter all questions that are includes in the response
                const filteredQuestions = questions.filter(
                    (question) =>
                        !response.some(
                            (res) => res.questionId === question.questionId
                        )
                )
                // add the new questions to the existing questions
                setQuestions([...filteredQuestions, ...response])
                setTotalPages(page)
            }
        } catch (error: any) {
            console.log(error)
            notify('Fail to load questions', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuestions()
    }, [])

    const handleDelete = (questionId: number) => {
        try {
            setLoading(true)
            questionService.deleteQuestion(questionId).then((response) => {
                if (response) {
                    notify('Question deleted successfully', 'success')
                    // remove the deleted question from the questions
                    setQuestions((prev) =>
                        prev.filter(
                            (question) => question.questionId !== questionId
                        )
                    )
                }
            })
        } catch (error: any) {
            console.log(error)
            notify('Fail to delete question', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = async (questionId: number) => {
        try {
            setLoading(true)
            const response = await questionService.getQuestion(questionId)
            if (response) {
                navigate(`${ROUTES.QUESTION_ROUTE}/update`, {
                    state: response
                })
            }
        } catch (error: any) {
            console.log(error)
            notify('Fail to load question', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleLoadMoreQs = async () => {
        if (currentPage === totalPages) await fetchQuestions(totalPages + 1)
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }

    return (
        <div className="flex flex-col justify-between max-w-6xl mx-auto p-6 h-[calc(100vh-8rem)]">
            <Link
                to={`${ROUTES.QUESTION_ROUTE}/create`}
                className="btn btn-success w-fit"
            >
                Create new question
            </Link>
            <div className="overflow-x-auto flex-1 py-6">
                <table className="w-full min-w-96">
                    <thead className="bg-base-200 text-base-content">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Question
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-base-100 divide-y divide-base-200">
                        {displayedQuestions.map((question, index) => (
                            <tr key={question.questionId ?? index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {question.questionId}
                                </td>
                                <td className="px-6 py-4 w-80">
                                    <div className="text-sm line-clamp-2 text-ellipsis">
                                        {question.content}
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    question?.questionId ?? 0
                                                )
                                            }
                                            disabled={loading}
                                            className="text-info"
                                        >
                                            <FontAwesomeIcon
                                                icon={faPenToSquare}
                                            />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    question?.questionId ?? 0
                                                )
                                            }
                                            disabled={loading}
                                            className="text-error"
                                        >
                                            <FontAwesomeIcon
                                                icon={faTrashCan}
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to{' '}
                    {Math.min(startIndex + questionsPerPage, questions.length)}{' '}
                    of {questions.length} questions
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1 || loading}
                        className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <div className="flex items-center space-x-1">
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded ${
                                    currentPage === page
                                        ? 'bg-base-300 text-base-content'
                                        : 'border hover:bg-base-200'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleLoadMoreQs}
                        disabled={loading}
                        className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ListQuestionsPage
