import { Button, Spinner } from 'flowbite-react';
import { set } from 'mongoose';
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function PostPage() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);


    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if (!res.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                if (res.ok) {
                    setPost(data.posts[0]);
                    setLoading(false);
                    setError(false);
                }
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postSlug]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size='xl' />
        </div>
    )


    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            <h1 className='mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>

            <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
                <Button className='mt-5 border-blue-700' color='gray' pill size='md'>{post && post.category}</Button>
            </Link>

            <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] rounded-lg w-full object-cover border-2 border-slate-500' />

            <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2x text-xs">
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{post && (post.content.length / 1000).toFixed(1)} mins read</span>
            </div>

            <div dangerouslySetInnerHTML={{ __html: post && post.content }} className="post-content p-3 max-w-2xl mx-auto w-full">

            </div>
        </main>
    )
}
