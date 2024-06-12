import Lottie from 'lottie-react';
import animationData from '../assets/Animation - 1718203405122.json';
import FlipWords from '../components/FlipWords';

export default function Home() {
    const words = ["Tips", "Tricks", "Guides", "News", "Tutorials"];
    return (
        <div className=''>
            <div className="flex flex-col h-[60vh] md:flex-row mx-20">
                <div className="flex-1 flex items-center justify-center py-6">
                    <div className="md:text-2xl font-normal text-neutral-600 dark:text-white">
                        Welcome to our blog, where we share,
                        <span className='bg-gradient-to-r mx-2 md:text-4xl rounded-lg text-white from-indigo-500 via-purple-500 to-pink-500'>
                            <FlipWords words={words} duration={2000} />
                        </span>
                        in web development.
                        <br />
                        <br />
                        Join our community and stay updated with the best practices and innovative solutions to enhance your web projects.
                    </div>
                </div>

                <div className="flex-1">
                    <Lottie animationData={animationData} className=' h-full p-6' />
                </div>
            </div>
        </div>
    )
}


