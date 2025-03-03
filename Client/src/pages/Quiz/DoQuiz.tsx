import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Countdown from '~/components/common/CountDown'
import { ROUTES } from '~/resources/routes-constants'
import roomService from '~/services/room'
import { useAppSelector } from '~/store/reducers/store'
import { notify } from '~/utility/functions'

const DoQuiz = () => {
    const { room, questions } = useAppSelector((state) => state.quiz)
    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState(false)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [currentAnswerId, setCurrentAnswerId] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<
        Record<number, number[]>
    >({})

    const closedAt = new Date(room?.closedAt as string).getTime()
    const [countdown, setCountdown] = useState<number>(
        Math.floor((closedAt - Date.now()) / 1000 + 25200)
    )

    const handleAnswerSelect = (answerId: number) => {
        const questionId = questions[currentQuestionIndex].questionId
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: [answerId]
        }))
    }

    const handleSubmitAnswer = async () => {
        setLoading(true)
        try {
            const response = await roomService.submitAnswer(
                room?.roomId as number,
                currentAnswerId
            )
            if (response) notify(response as string, 'success')
        } catch (error: any) {
            notify(error, 'error')
        } finally {
            setLoading(false)
        }

        const nextIndex = currentQuestionIndex + 1
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex)
        }
    }

    const navigate = useNavigate()
    const handleEndQuiz = () => {
        console.log('Quiz ended', selectedAnswers)
        navigate(`${ROUTES.QUIZ_ROUTE}/result`)
    }

    return (
        <div className="flex w-full h-[calc(100vh-4rem)]">
            <div className="flex h-full w-full bg-base-200">
                {/* Navigation Sidebar */}
                <div className="w-64 bg-base-100 flex flex-col justify-between border-r p-4">
                    <h2 className="text-xl font-bold mb-4">{room?.name}</h2>
                    <div className="space-y-2">
                        {questions.map((question, index) => (
                            <button
                                key={question.questionId}
                                onClick={() => setCurrentQuestionIndex(index)}
                                className={`btn ${
                                    currentQuestionIndex === index
                                        ? 'btn-info'
                                        : 'btn-ghost'
                                }`}
                            >
                                Question {index + 1}
                            </button>
                        ))}
                    </div>
                    <Countdown initialTime={countdown} />
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-base-100 rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium mb-4">
                                Question {currentQuestionIndex + 1} of{' '}
                                {questions.length}
                            </h3>
                            <p className="text-lg mb-6">
                                {questions[currentQuestionIndex].content}
                            </p>

                            <div className="space-y-4 mb-6">
                                {questions[currentQuestionIndex].answers.map(
                                    (answer: any) => (
                                        <label
                                            key={answer.answerId}
                                            className="flex items-center p-4 border rounded-sm cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${questions[currentQuestionIndex].questionId}`}
                                                checked={
                                                    selectedAnswers[
                                                        questions[
                                                            currentQuestionIndex
                                                        ].questionId
                                                    ]?.[0] === answer.answerId
                                                }
                                                onChange={() => {
                                                    handleAnswerSelect(
                                                        answer.answerId
                                                    )
                                                    setCurrentAnswerId(
                                                        answer.answerId
                                                    )
                                                }}
                                                className="mr-3"
                                            />
                                            {answer.content}
                                        </label>
                                    )
                                )}
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={handleSubmitAnswer}
                                    disabled={
                                        !selectedAnswers[
                                            questions[currentQuestionIndex]
                                                .questionId
                                        ] || loading
                                    }
                                    className="btn btn-info"
                                >
                                    Submit
                                </button>

                                <button
                                    onClick={handleEndQuiz}
                                    className="btn btn-success"
                                >
                                    End Quiz
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoQuiz
