import {
    faArrowTrendUp,
    faCloudArrowUp
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import MultiSelect from '~/components/common/MultiSelect'
import quizService from '~/services/quiz'
import { question, quiz } from '~/types/services'
import { notify } from '~/utility/functions'

const CreateQuizPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Omit<quiz, 'id'>>()
    const [loading, setLoading] = useState(false)

    const [questions, setQuestions] = useState<question[]>([
        {
            id: 1,
            question: 'What is the capital of France?',
            options: ['Paris', 'London', 'Berlin', 'Madrid']
        },
        {
            id: 2,
            question: 'What is the capital of Germany?',
            options: ['Paris', 'London', 'Berlin', 'Madrid']
        },
        {
            id: 3,
            question: 'What is the capital of Spain?',
            options: ['Paris', 'London', 'Berlin', 'Madrid']
        },
        {
            id: 4,
            question: 'What is the capital of England?',
            options: ['Paris', 'London', 'Berlin', 'Madrid']
        }
    ])

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // TODO fetch questions from the server
            } catch (error: any) {
                notify(error, 'error')
            }
        }
        fetchQuestions()
    }, [])

    const handleSelect = (selectedList: question[]) => {
        register('questions', { value: selectedList })
    }

    const handleRemove = (selectedList: question[]) => {
        register('questions', { value: selectedList })
    }

    const handleCreateQuiz = async (quiz: Omit<quiz, 'id'>) => {
        console.log(quiz)
        if (!quiz.questions?.length) {
            notify('Select at least one question', 'error')
            return
        }
        setLoading(true)
        try {
            const response = await quizService.createQuiz(quiz)
            console.log(response)
        } catch (error: any) {
            notify(error, 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center max-w-7xl w-full p-4">
            <div className="flex flex-col justify-center items-center w-full bg-base-100 p-4 gap-4 rounded-md shadow-md">
                <h1 className="text-3xl text-primary">
                    What would you like to create?
                </h1>
                <form
                    className="p-4 flex flex-col items-center md:flex-row gap-4 w-full max-w-3xl"
                    onSubmit={handleSubmit(handleCreateQuiz)}
                >
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
                                <span className="text-xs">Upload image</span>
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
                                {...register('name', {
                                    required: 'Quiz name is required'
                                })}
                            />
                        </label>
                        {errors.name && (
                            <span className="text-xs text-error">
                                {errors.name.message}
                            </span>
                        )}
                        <label className="label cursor-pointer">
                            <span className="flex gap-2 items-center">
                                Make this quiz public
                            </span>
                            <input
                                type="checkbox"
                                className="toggle toggle-accent"
                                defaultChecked
                                {...register('isPrivate')}
                            />
                        </label>
                        <MultiSelect
                            options={questions}
                            onSelect={handleSelect}
                            onRemove={handleRemove}
                            displayKey="question"
                            tooltipKey="options"
                            placeholder="Select questions"
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create quiz'}
                        </button>
                    </div>
                </form>
            </div>
            <div className="flex flex-col w-full gap-2">
                <div className="flex items-center gap-2 p-4">
                    <FontAwesomeIcon icon={faArrowTrendUp} />
                    <h2>Trending activities</h2>
                </div>
            </div>
        </div>
    )
}

export default CreateQuizPage
