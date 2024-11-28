import React from 'react'
import Footer from '~/components/Footer'
import Navbar from '~/components/Navbar'

const HomePage: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="h-96"></div>
            <Footer />
        </>
    )
}

export default HomePage
