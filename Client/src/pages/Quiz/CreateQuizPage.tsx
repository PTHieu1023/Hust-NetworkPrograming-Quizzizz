import {
    faArrowTrendUp,
    faCloudArrowUp
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MultiSelect from '~/components/common/MultiSelect'
import { ROUTES } from '~/resources/routes-constants'
import questionService from '~/services/question'
import quizService from '~/services/quiz'
import { question, quiz } from '~/types/services'
import { notify } from '~/utility/functions'

const CreateQuizPage: React.FC = () => {
    const [quiz, setQuiz] = useState<quiz>({
        name: '',
        isPrivate: false,
        questions: []
    })
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState<question[]>([])
    const [page, setPage] = useState(1)

    const navigate = useNavigate()

    const fetchQuestions = async (page: number) => {
        try {
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
            }
        } catch (error: any) {
            console.log(error)
            notify('Fail to load questions', 'error')
        }
    }

    useEffect(() => {
        fetchQuestions(page)
    }, [])

    const handleLoadMoreQs = async () => {
        setPage(page + 1)
        setLoading(true)
        await fetchQuestions(page + 1)
        setLoading(false)
    }

    const handleSelect = (selectedList: question[]) => {
        setQuiz({
            ...quiz,
            questions: selectedList
                .map((q) => q.questionId)
                .filter((id): id is number => id !== undefined)
        })
    }

    const handleRemove = (selectedList: question[]) => {
        setQuiz({
            ...quiz,
            questions: selectedList
                .map((q) => q.questionId)
                .filter((id): id is number => id !== undefined)
        })
    }

    const handleCreateQuiz = async (quiz: Omit<quiz, 'id'>) => {
        console.log(quiz)
        if (!quiz.name) {
            notify('Quiz name is required', 'error')
            return
        }
        if (!quiz.questions?.length) {
            notify('Select at least one question', 'error')
            return
        }
        setLoading(true)
        try {
            const response = await quizService.createQuiz(quiz)
            console.log(response)
            notify('Quiz created successfully', 'success')
            navigate(`${ROUTES.DASHBOARD_ROUTE}?tab=my-quiz`)
        } catch (error: any) {
            notify(error, 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative w-full">
            <div className="absolute md:inset-y-0 md:left-0 md:w-40 md:h-auto md:px-0 w-full h-min inset-x-0 bottom-16 gap-4 px-8">
                <div className="flex md:flex-col justify-between bg-base-200 p-4 gap-2 md:rounded-br-md md:rounded-none rounded-full shadow-md">
                    <span className="btn btn-ghost btn-circle w-fit md:w-full">
                        Create quiz
                    </span>
                    <Link
                        to={`${ROUTES.DASHBOARD_ROUTE}?tab=my-quiz`}
                        className="btn btn-ghost btn-circle w-fit md:w-full"
                    >
                        My quizzes
                    </Link>
                    <Link
                        to={`${ROUTES.QUESTION_ROUTE}/all-questions`}
                        className="btn btn-ghost btn-circle w-fit md:w-full"
                    >
                        All questions
                    </Link>
                </div>
            </div>
            <div className="flex items-center max-w-7xl w-full p-4">
                <div className="md:w-40"></div>
                <div className="flex flex-col flex-1 p-4">
                    <div className="flex flex-col justify-center items-center w-full bg-base-100 p-4 gap-4 rounded-md shadow-md">
                        <h1 className="text-3xl text-primary">
                            What would you like to create?
                        </h1>
                        <div className="p-4 flex flex-col items-center lg:flex-row gap-4 w-full max-w-3xl">
                            <div className="flex items-center justify-center w-1/3 min-h-32 bg-base-300 border border-primary border-dashed rounded-md">
                                <label
                                    htmlFor="upload-image"
                                    className="flex flex-col gap-2 items-center cursor-pointer"
                                >
                                    <input
                                        type="file"
                                        id="upload-image"
                                        className="hidden"
                                    />
                                    <div className="flex flex-col gap-2 items-center">
                                        <FontAwesomeIcon
                                            icon={faCloudArrowUp}
                                            size="2x"
                                            className="text-primary"
                                        />
                                        <span className="text-xs">
                                            Upload image
                                        </span>
                                    </div>
                                </label>
                            </div>
                            <div className="flex flex-col gap-4 md:w-2/3 w-full max-w-lg">
                                <label className="input input-bordered flex items-center gap-2">
                                    Quiz name:
                                    <input
                                        type="text"
                                        className="grow"
                                        placeholder="Enter quiz name"
                                        onChange={(e) =>
                                            setQuiz({
                                                ...quiz,
                                                name: e.target.value
                                            })
                                        }
                                    />
                                </label>

                                <label className="label cursor-pointer">
                                    <span className="flex gap-2 items-center">
                                        Make this quiz public
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-accent"
                                        defaultChecked
                                        onChange={(e) =>
                                            setQuiz({
                                                ...quiz,
                                                isPrivate: e.target.checked
                                            })
                                        }
                                    />
                                </label>

                                <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                                    <button
                                        className="btn btn-outline btn-accent w-full md:w-fit"
                                        disabled={loading}
                                        onClick={handleLoadMoreQs}
                                    >
                                        Load more questions
                                    </button>
                                    Or
                                    <Link
                                        to={`${ROUTES.QUESTION_ROUTE}/create`}
                                        className="btn btn-outline btn-success w-full md:w-fit"
                                    >
                                        Create questions
                                    </Link>
                                </div>
                                <MultiSelect
                                    options={questions}
                                    onSelect={handleSelect}
                                    onRemove={handleRemove}
                                    displayKey="content"
                                    placeholder="Select questions"
                                />

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                    onClick={() => handleCreateQuiz(quiz)}
                                >
                                    {loading ? 'Creating...' : 'Create quiz'}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full gap-2">
                        <div className="flex items-center gap-2 p-4">
                            <FontAwesomeIcon icon={faArrowTrendUp} />
                            <h2>Trending activities</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateQuizPage
