import { faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, Outlet, useParams } from 'react-router-dom'
import ThemePicker from '~/components/ThemePicker'
import ThemeToggle from '~/components/ThemeToggle'
import { ROUTES } from '~/resources/routes-constants'

const QuizLayout: React.FC = () => {
    const { mode } = useParams()

    return (
        <div className="w-full h-full relative">
            <div className="fixed w-full h-min z-5 top-0 flex-grow-0 flex-shrink-0">
                <div className="flex items-center justify-start flex-row flex-nowrap w-full bg-base-100 shadow-md">
                    <div className="flex p-2 mx-auto items-center justify-between flex-row flex-nowrap w-full h-full">
                        <Link
                            to={ROUTES.DASHBOARD_ROUTE}
                            className="btn btn-ghost btn-circle"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Link>
                        <div className="flex flex-end gap-2 px-2">
                            <button className="btn btn-ghost btn-circle">
                                <FontAwesomeIcon icon={faGear} />
                            </button>

                            <ThemePicker className="md:block hidden" />
                            <ThemeToggle className="md:hidden" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center py-16 min-h-screen w-full bg-base-300">
                <Outlet />
            </div>
        </div>
    )
}

export default QuizLayout
