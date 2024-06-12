import Lottie from 'lottie-react';
import animationData from '../assets/Animation - 1718203405122.json';
import FlipWords from '../components/FlipWords';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Home() {
    const { currentUser } = useSelector((state) => state.user);
    const words = ["Tips", "Tricks", "Guides", "News", "Tutorials"];
    return (
        <div className=''>
            <div className="flex flex-col sm:h-[85vh] md:h-[60vh]  md:flex-row mx-20">
                <div className="flex-1 flex items-center justify-center py-6">
                    <div className="md:text-2xl font-normal text-neutral-600 dark:text-white">
                        Welcome to our blog, where we share,
                        <span className='bg-gradient-to-r mx-2 md:text-4xl rounded-lg from-indigo-500 via-purple-500 to-pink-500'>
                            <FlipWords words={words} duration={2000}/>
                        </span>
                        in web development.
                        <br />
                        <br />
                        {!currentUser ?
                            <Link to='/sign-in'><span className=' text-[#DA4AA2] font-extrabold hover:text-3xl'>Join our community</span></Link> : <span>Join our community</span>}   and stay updated with the best practices and innovative solutions to enhance your web projects.
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center py-6">
                    <Lottie animationData={animationData} className=' h-96 md:h-[100%]' />
                </div>
            </div>
        </div>
    )
}


