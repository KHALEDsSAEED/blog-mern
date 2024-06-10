import { Table, Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { set } from "mongoose";



export default function DashPosts() {
    const { currentUser } = useSelector(state => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postidToDelete, setPostIdToDelete] = useState('');

    // console.log(userPosts);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
                const data = await res.json();
                if (res.ok) {
                    setUserPosts(data.posts);
                    if (data.posts.length < 9) setShowMore(false);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) fetchPosts();
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) setShowMore(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeletePost = async () => {
        setShowModal(false);
        try{
            const res= await fetch(`/api/post/deletepost/${postidToDelete}/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if(!res.ok){
                console.log(data.message);
            }
            else{
                setUserPosts((prev) => prev.filter((post) => post._id !== postidToDelete)); // Remove the post from the state
            }
        }
        catch(error){
            console.log(error.message);
        }
    };

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 w-full 
        scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
        dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className="shadown-md">
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell><span>Edit</span></Table.HeadCell>
                        </Table.Head>
                        {userPosts.map(
                            (post) => (
                                <Table.Body className="divide-y">
                                    <Table.Row className=" bg-white dark:bg-gray-800 dark:border-gray-700">
                                        <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell>
                                            <Link to={`/posts/${post.slug}`}>
                                                <img src={post.image} alt={post.title} className="w-20 h-10 object-cover bg-gray-200" />
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link className="font-medium text-gray-900 dark:text-white" to={`/posts/${post.slug}`}>{post.title}</Link>
                                        </Table.Cell>
                                        <Table.Cell>{post.category}</Table.Cell>
                                        <Table.Cell>
                                            <span onClick={() => {
                                                setShowModal(true);
                                                setPostIdToDelete(post._id);
                                            }}
                                                className="font-medium text-red-500 hover:underline hover:cursor-pointer">
                                                Delete
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link to={`/update-post/${post._id}`}>
                                                <span className="text-teal-500 hover:underline hover:cursor-pointer">
                                                    Edit
                                                </span>
                                            </Link>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            )
                        )}
                    </Table>
                    {showMore && (
                        <button onChange={handleShowMore}
                            className="w-full text-teal-500 self-center text-sm py-7 hover:cursor-pointer hover:underline">
                            Show more
                        </button>
                    )}
                </>
            ) : (<p>No posts found</p>)}

            <Modal show={showModal} popup size='lg' onClose={() => setShowModal(false)}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle size={100} className="h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to <b>DELETE</b> this post?</h3>
                        <div className="flex justify-evenly">
                            <Button color='failure' onClick={handleDeletePost}>Yes, I'm sure</Button>
                            <Button color='success' onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>

        </div >
    )
}
