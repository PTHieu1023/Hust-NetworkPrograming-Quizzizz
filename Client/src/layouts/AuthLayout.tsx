import { Outlet, useSearchParams } from 'react-router-dom'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { useAppSelector } from '~/store/reducers/store'

const AuthLayout: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth)
    const [queryParams] = useSearchParams()
    const tab = queryParams.get('tab') ?? 'home'
    return (
        <>
            <Header tab={tab} user={user} />
            <Outlet />
            <Footer />
        </>
    )
}

export default AuthLayout
