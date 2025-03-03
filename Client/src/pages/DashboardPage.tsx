import { useSearchParams } from 'react-router-dom'
import Activities from './Home/Activities'
import Home from './Home/Home'
import MyQuiz from './Home/MyQuiz'

const DashboardPage: React.FC = () => {
    const [queryParams] = useSearchParams()
    const tab = queryParams.get('tab') ?? 'home'

    return (
        <>
            {tab === 'home' && <Home />}

            {tab === 'activity' && <Activities />}

            {tab === 'my-quiz' && <MyQuiz />}
        </>
    )
}

export default DashboardPage
