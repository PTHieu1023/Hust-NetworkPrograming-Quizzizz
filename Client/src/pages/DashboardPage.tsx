import { useSearchParams } from 'react-router-dom'
import Activity from './Home/Activity'
import Home from './Home/Home'
import MyQuiz from './Home/MyQuiz'

const DashboardPage: React.FC = () => {
    const [queryParams] = useSearchParams()
    const tab = queryParams.get('tab') ?? 'home'

    return (
        <>
            {tab === 'home' && <Home />}

            {tab === 'activity' && <Activity />}

            {tab === 'my-quiz' && <MyQuiz />}
        </>
    )
}

export default DashboardPage
