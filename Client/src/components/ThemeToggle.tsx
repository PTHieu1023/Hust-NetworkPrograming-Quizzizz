import React from 'react'
import { toggleTheme } from '~/store/actions/theme'
import { useAppDispatch, useAppSelector } from '~/store/reducers/store'

const ThemeToggle: React.FC<{ className?: string }> = ({
    className = '',
    ...props
}) => {
    const dispatch = useAppDispatch()
    const currentTheme = useAppSelector((state) => state.theme.mode)

    const handleToggle = () => {
        dispatch(toggleTheme())
    }

    return (
        <div {...props} className={className}>
            <button
                className="btn btn-accent text-accent-content w-24"
                onClick={handleToggle}
            >
                {currentTheme}
            </button>
        </div>
    )
}

export default ThemeToggle
