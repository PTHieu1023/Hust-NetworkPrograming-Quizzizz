import React from 'react'
import ThemePicker from '~/components/ThemePicker'
import ThemeToggle from '~/components/ThemeToggle'
import DateDisplay from '../components/DateDisplay'

const HomePage: React.FC = () => {
    return (
        <div className="relative flex justify-center items-center flex-col w-full">
            <h1 className="text-6xl">Hello world!</h1>
            <DateDisplay />
            <ThemeToggle />
            <ThemePicker />
        </div>
    )
}

export default HomePage
