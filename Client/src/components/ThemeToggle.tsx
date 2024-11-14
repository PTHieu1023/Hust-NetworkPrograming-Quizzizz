// src/components/ThemeToggle.tsx
import React from 'react'
import { toggleTheme } from '~/store/actions/theme'
import { useAppDispatch, useAppSelector } from '~/store/reducers/store'

const ThemeToggle: React.FC = () => {
    const dispatch = useAppDispatch()
    const theme = useAppSelector((state) => state.themes.mode)

    const handleToggle = () => {
        dispatch(toggleTheme())
    }

    return (
        <button className="btn btn-primary text-primary-content" onClick={handleToggle}>
            {theme}
        </button>
    )
}

export default ThemeToggle
