import Lottie from 'lottie-react';
import animationData from '../assets/Animation - 1718203405122.json';
import FlipWords from '../components/FlipWords';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import CallToAction from '../components/CallToAction';

export default function Home() {
    const { currentUser } = useSelector((state) => state.user);
    const [posts, setPosts] = useState([]);
    const words = ["Tips", "Tricks", "Guides", "News", "Tutorials"];

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch('/api/post/getPosts');
            const data = await res.json();
            setPosts(data.posts);
        };
        fetchPosts();
    }, []);

    return (
        <div className=''>

            <div className="flex flex-col sm:h-[85vh] md:h-[60vh]  md:flex-row mx-20">
                <div className="flex-1 flex items-center justify-center py-6">
                    <div className="md:text-2xl font-normal text-neutral-600 dark:text-white">
                        Welcome to our blog, where we share,
                        <span className='bg-gradient-to-r mx-2 md:text-4xl rounded-lg from-indigo-500 via-purple-500 to-pink-500'>
                            <FlipWords words={words} duration={2000} />
                        </span>
                        in web development.
                        <br />
                        <br />
                        {!currentUser ?
                            <Link to='/sign-in'><span className=' text-[#DA4AA2] font-extrabold hover:text-3xl'>Join our community</span></Link> : <span>Join our community</span>}
                        and stay updated with the best practices and innovative solutions to enhance your web projects.
                        <br />
                        <br />
                        <Link to='/search' className='text-xs sm:text-2xl text text-teal-500 font-bold hover:underline'>
                            View all Posts.
                        </Link>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center py-6">
                    <Lottie animationData={animationData} className=' h-96 md:h-[100%]' />
                </div>

            </div>
            {/*================================================================================*/}
            <div className="p-3 mx-6">
                <CallToAction />
            </div>

            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
                {posts && posts.length > 0 && (
                    <div className='flex flex-col gap-6'>
                        <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
                        <div className='flex flex-wrap gap-4'>
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                        <Link
                            to={'/search'}
                            className='text-lg text-teal-500 hover:underline text-center'
                        >
                            View all posts
                        </Link>
                    </div>
                )}
            </div>

        </div>
    )
}


