import { Link } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'

const MyQuiz: React.FC = () => {
    return (
        <div className="flex flex-col justify-center items-center gap-4 min-h-[75vh]">
            <h1>You do not have any quiz</h1>
            <Link
                to={`${ROUTES.QUIZ_ROUTE}/create`}
                className="btn btn-success"
            >
                Create a quiz
            </Link>
        </div>
    )
}

export default MyQuiz
