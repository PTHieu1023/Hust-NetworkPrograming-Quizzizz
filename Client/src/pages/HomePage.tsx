import React from 'react'
import DateDisplay from '../components/DateDisplay'

const HomePage: React.FC = () => {
    return (
        <div className="relative flex justify-center items-center flex-col w-full h-full">
            <h1 className="text-6xl">Hello world!</h1>
            <DateDisplay />
        </div>
    )
}

export default HomePage
