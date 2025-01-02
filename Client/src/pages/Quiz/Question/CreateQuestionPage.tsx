import { faCirclePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import questionService from '~/services/question'
import { question } from '~/types/services'
import { notify } from '~/utility/functions'

const CreateQuestionPage: React.FC = () => {
    const navigate = useNavigate()
    const question = useLocation().state as question
    const { mode } = useParams()

    const [currQuestion, setQuestion] = useState<question>(
        question ?? {
            content: '',
            answers: [{ content: '', isTrue: false }]
        }
    )
    const [loading, setLoading] = useState(false)

    const addAnswer = () => {
        setQuestion((prev) => ({
            ...prev,
            answers: [...(prev.answers ?? []), { content: '', isTrue: false }]
        }))
    }

    const removeAnswer = (index: number) => {
        setQuestion((prev) => ({
            ...prev,
            answers: (prev.answers ?? []).filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async () => {
        if (!currQuestion.content) {
            notify('Question content is required', 'error')
            return
        }
        try {
            setLoading(true)
            const response =
                mode === 'create'
                    ? await questionService.createQuestion(currQuestion)
                    : await questionService.updateQuestion(currQuestion)
            if (response) {
                notify('Question created successfully', 'success')
                navigate(`${ROUTES.QUESTION_ROUTE}/all-questions`)
            }
        } catch (error: any) {
            console.log(error)
            notify('Fail to create question', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center max-w-5xl w-full p-4">
            <div className="flex justify-center items-center w-full bg-base-100/50 text-base-content p-4 gap-4 rounded-md shadow-md">
                <div className="flex flex-col gap-4 max-w-2xl mx-auto p-6">
                    <textarea
                        cols={50}
                        rows={3}
                        className="textarea textarea-bordered"
                        placeholder="Type your question here..."
                        value={currQuestion.content}
                        onChange={(e) =>
                            setQuestion({
                                ...currQuestion,
                                content: e.target.value
                            })
                        }
                    ></textarea>
                    <div className="space-y-4 h-80 overflow-y-auto border rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                                Answers
                            </label>
                            <button
                                type="button"
                                onClick={addAnswer}
                                className="flex items-center gap-2 btn btn-info"
                            >
                                <FontAwesomeIcon icon={faCirclePlus} />
                                Add Answer
                            </button>
                        </div>
                        {(currQuestion?.answers ?? []).map((answer, index) => (
                            <div key={index} className="flex gap-4">
                                <input
                                    type="text"
                                    value={answer.content}
                                    onChange={(e) => {
                                        const newAnswers = [
                                            ...(currQuestion?.answers ?? [])
                                        ]
                                        newAnswers[index].content =
                                            e.target.value
                                        setQuestion((prev) => ({
                                            ...prev,
                                            answers: newAnswers
                                        }))
                                    }}
                                    className="flex-1 p-2 border rounded-md"
                                    placeholder={`Answer ${index + 1}`}
                                    required
                                />
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={answer.isTrue}
                                        onChange={(e) => {
                                            const newAnswers = [
                                                ...(currQuestion?.answers ?? [])
                                            ]
                                            newAnswers[index].isTrue =
                                                e.target.checked
                                            setQuestion((prev) => ({
                                                ...prev,
                                                answers: newAnswers
                                            }))
                                        }}
                                        className="w-4 h-4"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeAnswer(index)}
                                        className="text-error hover:font-bold"
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? 'Saving...' : 'Save question'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateQuestionPage
