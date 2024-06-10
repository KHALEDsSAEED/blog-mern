import { Sidebar } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { HiArrowSmRight, HiUserCircle } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromURL = urlParams.get("tab");
        if (tabFromURL) {
            setTab(tabFromURL);
        }
    }, [location]);

    const handleSignout = async () => {
        try {
            const res = await fetch('api/user/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (res.ok) {
                dispatch(signoutSuccess());

            }
            else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item
                            active={tab == 'profile'}
                            as='div' icon={HiUserCircle}
                            label={"User"}
                            labelColor='dark'>
                            Profile
                        </Sidebar.Item>
                    </Link >
                    <Sidebar.Item icon={HiArrowSmRight} onClick={handleSignout} className='cursor-pointer'>Sign Out</Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}
