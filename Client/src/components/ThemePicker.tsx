import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setTheme } from '~/store/actions/theme'
import { useAppDispatch } from '~/store/reducers/store'
import { Theme, themes } from '~/store/reducers/theme'
const ThemePicker = () => {
    const dispatch = useAppDispatch()

    const handleSetTheme = (theme: Theme) => {
        dispatch(setTheme(theme))
    }

    return (
        <div className="dropdown dropdown-end hidden md:block">
            <div tabIndex={0} role="button" className="btn mx-2">
                Theme
                <FontAwesomeIcon icon={faAngleDown} />
            </div>
            <div
                tabIndex={0}
                className="dropdown-content bg-base-200 text-base-content rounded-box z-[1] w-52 max-h-[calc(100vh-20rem)] overflow-y-auto border border-white/5 shadow-2xl outline outline-1 outline-white/5"
            >
                <div className="grid grid-cols-1 gap-3 p-3">
                    {themes.map((theme, index) => (
                        <button
                            key={index}
                            onClick={() => handleSetTheme(theme)}
                            className="px-2 rounded-btn outline-base-content text-start outline-offset-1 hover:opacity-75 hover:text-primary"
                        >
                            {theme}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ThemePicker
