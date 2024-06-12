import { Table, Button, Modal, Spinner } from "flowbite-react";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";


export default function DashUsers() {
    const { currentUser } = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');
    const [userNameToDelete, setUserNameToDelete] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    setLoading(false);
                    if (data.users.length < 9) setShowMore(false);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) fetchUsers();
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) setShowMore(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(users.filter(user => user._id !== userIdToDelete));
                setShowModal(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size='xl' />
        </div>
    )


    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 w-full 
        scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
        dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className="shadown-md">
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>User Image</Table.HeadCell>
                            <Table.HeadCell>User Name</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {users.map(
                            (user) => (

                                <Table.Body className="divide-y" key={user._id}>
                                    <Table.Row className=" bg-white dark:bg-gray-800 dark:border-gray-700">
                                        <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell>
                                            <img src={user.profilePicture} alt={user.username} className=" w-11 h-11 rounded-full object-cover bg-gray-200" />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {user.username}
                                        </Table.Cell>
                                        <Table.Cell>{user.email}</Table.Cell>
                                        <Table.Cell>{user.isAdmin ? <FaCheck className=" text-green-500" /> : <FaTimes className="text-red-500" />}</Table.Cell>

                                        <Table.Cell>
                                            <span onClick={() => {
                                                setShowModal(true);
                                                setUserIdToDelete(user._id);
                                                setUserNameToDelete(user.username);
                                            }}
                                                className="font-medium text-red-500 hover:underline hover:cursor-pointer">
                                                Delete
                                            </span>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            )
                        )}
                    </Table>
                    {showMore && (
                        <button onClick={handleShowMore}
                            className="w-full text-teal-500 self-center text-sm py-7 hover:cursor-pointer hover:underline">
                            Show more
                        </button>
                    )}
                </>
            ) : (<p>No users found</p>)}

            <Modal show={showModal} popup size='lg' onClose={() => setShowModal(false)}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle size={100} className="h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to <span className="text-red-500">DELETE</span> <b> "{userNameToDelete}"</b>?</h3>
                        <div className="flex justify-evenly">
                            <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                            <Button color='success' onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>

        </div >
    )
}
