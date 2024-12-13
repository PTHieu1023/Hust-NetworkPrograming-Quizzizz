import { faClock, faFaceGrinTears, faPlay, faShareNodes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SetupPracticePage: React.FC = () => {
    return (
        <div className="flex flex-col items-center py-16 min-h-screen w-full bg-primary/75">
            <div className="flex flex-wrap justify-center max-w-7xl w-full p-4">
                <div className="w-full md:w-1/2 p-4">
                    <div className="flex justify-center min-h-64 p-8 rounded-lg bg-white/10">
                        <form className="flex flex-col gap-4 justify-center items-center w-full max-w-80" onSubmit={() => {}}>
                            <div className="flex justify-between w-full">
                                <div className="bg-neutral">
                                    <span className="text-neutral-content">Quiz img here</span>
                                </div>
                                <div className="text-base-content">
                                    <h1 className="text-3xl">Quiz name</h1>
                                    <span>Number of questions</span>
                                </div>
                            </div>
                            <button className="btn flex items-center justify-center w-full">
                                <FontAwesomeIcon icon={faShareNodes} />
                                Share
                            </button>
                            <div className="flex flex-col justify-center items-center w-full">
                                <span className="text-left w-full mb-4">Settings</span>
                                <div className="form-control w-60">
                                    <label className="label cursor-pointer">
                                        <span className="flex gap-2 items-center">
                                            <FontAwesomeIcon className="w-6" icon={faClock} />
                                            Timer
                                        </span>
                                        <input type="checkbox" className="toggle toggle-accent" defaultChecked />
                                    </label>
                                </div>
                                <div className="form-control w-60">
                                    <label className="label cursor-pointer">
                                        <span className="flex gap-2 items-center">
                                            <FontAwesomeIcon className="w-6" icon={faFaceGrinTears} />
                                            Memes
                                        </span>
                                        <input type="checkbox" className="toggle toggle-accent" />
                                    </label>
                                </div>
                            </div>
                            <button className="btn btn-accent flex items-center justify-center w-full" type="submit">
                                <FontAwesomeIcon icon={faPlay} />
                                Start
                            </button>
                        </form>
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-4">
                    <div className="flex justify-center items-center min-h-64 p-8 rounded-lg bg-white/10">Recent activity</div>
                </div>
            </div>
        </div>
    )
}

export default SetupPracticePage
