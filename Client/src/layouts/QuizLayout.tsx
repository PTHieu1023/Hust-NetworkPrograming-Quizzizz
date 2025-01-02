import { faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Outlet, useNavigate } from 'react-router-dom'
import ThemePicker from '~/components/ThemePicker'
import ThemeToggle from '~/components/ThemeToggle'

const QuizLayout: React.FC = () => {
    const navigate = useNavigate()

    const handleGetBack = () => {
        navigate(-1)
    }

    return (
        <div className="w-full h-full relative">
            <div className="fixed w-full h-min z-5 top-0 flex-grow-0 flex-shrink-0">
                <div className="flex items-center justify-start flex-row flex-nowrap w-full bg-base-100 text-base-content shadow-md">
                    <div className="flex p-2 mx-auto items-center justify-between flex-row flex-nowrap w-full h-full">
                        <button
                            className="btn btn-ghost btn-circle"
                            onClick={handleGetBack}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
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
            <div className="flex flex-col items-center pt-16 min-h-screen w-full">
                <Outlet />
            </div>
        </div>
    )
}

export default QuizLayout
