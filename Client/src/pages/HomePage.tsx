import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'
import Slider from '~/components/common/Slider'
import Footer from '~/components/Footer'
import Navbar from '~/components/Navbar'
import { ROUTES } from '~/resources/routes-constants'

const slides = ['Trusted_app.png', 'Common_sense.png', 'ISTE_seal.png', 'Digital_learning.png', 'ISO_certified.png']

const HomePage: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="hero min-h-screen">
                <div className="hero-content text-center">
                    <div className="max-w-xl">
                        <h1 className="text-5xl font-bold">"Hello there"</h1>
                        <p className="text-xl my-4 opacity-65">- Almost everybody</p>
                        <div className="w-full border-t-[1px] border-base-content/40"></div>
                        <p className="py-6">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores illo sint ad quis aspernatur cum dolorem, modi, temporibus
                            cupiditate nesciunt deleniti magni laboriosam amet cumque expedita adipisci nulla, quisquam atque.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                to={ROUTES.LOGIN_ROUTE}
                                className="btn btn-primary transition-all ease-in-out duration-300 translate-y-0 hover:-translate-y-1"
                            >
                                Get Started
                                <FontAwesomeIcon icon={faAngleRight} />
                            </Link>
                            <Link
                                to={ROUTES.GUIDED_TOUR_ROUTE}
                                className="btn btn-secondary btn-outline transition-all ease-in-out duration-300 translate-y-0 hover:-translate-y-1"
                            >
                                Learn more
                                <FontAwesomeIcon icon={faAngleRight} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default HomePage
