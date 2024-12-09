import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'
import AnimateOnScroll from '~/components/common/AnimationOnScroll'
import Footer from '~/components/Footer'
import Navbar from '~/components/Navbar'
import { ROUTES } from '~/resources/routes-constants'

const logos = ['Trusted_app.png', 'Common_sense.png', 'ISTE_seal.png', 'Digital_learning.png', 'ISO_certified.png']

const HomePage: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="hero lg:h-screen lg:mt-0 lg:py-0 mt-16 py-12">
                <div className="hero-content text-center">
                    <div className="max-w-xl">
                        <h1 className="lg:text-7xl md:text-5xl text-3xl font-bold">"Hello there"</h1>
                        <p className="text-xl my-4 opacity-65">- Almost everybody</p>
                        <div className="w-full border-t-[1px] border-base-content/40"></div>
                        <p className="py-8 lg:text-xl leading-8 text-balance">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores illo sint ad quis aspernatur cum dolorem, modi, temporibus
                            cupiditate nesciunt deleniti magni laboriosam amet cumque expedita adipisci nulla, quisquam atque.
                        </p>
                        <div className="flex md:flex-row flex-col gap-4 justify-center mx-6">
                            <Link
                                to={ROUTES.LOGIN_ROUTE}
                                className="btn lg:btn-lg lg:shadow-lg btn-primary transition-all ease-in-out duration-300 translate-y-0 hover:-translate-y-1"
                            >
                                Get Started
                                <FontAwesomeIcon icon={faAngleRight} />
                            </Link>
                            <Link
                                to={ROUTES.GUIDED_TOUR_ROUTE}
                                className="btn lg:btn-lg lg:shadow-lg btn-secondary btn-outline transition-all ease-in-out duration-300 translate-y-0 hover:-translate-y-1"
                            >
                                Learn more
                                <FontAwesomeIcon icon={faAngleRight} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                <div className="flex overflow-hidden group max-w-2xl mx-6 py-6">
                    <div className="flex loop-scroll group-hover:paused w-full">
                        {logos.map((logo, index) => (
                            <div key={index} className="md:w-32 md:h-32 w-16 h-16 rounded-lg flex items-center justify-center">
                                <div className="md:h-24 md:w-24 h-12 w-12">
                                    <img src={`/public/logos/${logo}`} alt="logo" className="object-cover w-full h-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex loop-scroll group-hover:paused w-full" aria-hidden="true">
                        {logos.map((logo, index) => (
                            <div key={index} className="md:w-32 md:h-32 w-16 h-16 rounded-lg flex items-center justify-center">
                                <div className="md:h-24 md:w-24 h-12 w-12">
                                    <img src={`/public/logos/${logo}`} alt="logo" className="object-cover w-full h-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center text-xl max-w-xl">
                    Trusted by teachers in <span className="text-primary">90% of U.S. Schools</span> and
                    <span className="text-primary"> 150+ countries.</span>
                </div>

                <AnimateOnScroll animationClass="float-in">
                    <div className="max-w-5xl text-center text-5xl py-16 font-bold animate-floatIn">
                        Now we support every part of your lesson. Here’s how it works
                    </div>
                </AnimateOnScroll>
            </div>

            <Footer />
        </>
    )
}

export default HomePage
