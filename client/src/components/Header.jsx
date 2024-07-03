import { useState, useEffect } from 'react'
import { Navbar, TextInput, Button, Dropdown, Avatar, Alert } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { HiLogout, HiViewGrid } from "react-icons/hi";
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';


export default function Header() {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };


    return (
        <Navbar className='border-b-2 sticky top-0 backdrop-blur-2xl z-30'>
            <Link to='/' className='self-center whitespace-nowrap
            text-sm sm:text-xl font-semibold  dark:text-white'>
                <span className='px-2 mr-1 py-1 bg-gradient-to-r text-white
                from-indigo-500 via-purple-500 to-pink-500 rounded-lg'>
                    Dev's
                </span>
                Blog
            </Link>
            <div className="hidden lg:inline">
                <form onSubmit={handleSubmit}>
                    <TextInput
                        type='text'
                        placeholder='Search...'
                        rightIcon={AiOutlineSearch}
                        className='hidden lg:inline'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
                <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                    <AiOutlineSearch />
                </Button>
            </div>



            <div className='flex gap-2 md:order-2'>
                <Button className='w-12 h-10 inline' gradientDuoTone='tealToLime' outline color='grey' pill onClick={() => {
                    dispatch(toggleTheme());
                }}>
                    {theme === 'light' ? <FaMoon /> : <FaSun />}
                </Button>

                {currentUser ? (
                    <Dropdown className=' z-20' arrowIcon={false} inline label={
                        <Avatar alt='user' img={currentUser.profilePicture} rounded bordered />
                    }>
                        <Dropdown.Header>
                            <span className='block text-lg'>@{currentUser.username}</span>
                            <span className='block text-lg truncate'>{currentUser.email}</span>
                        </Dropdown.Header>
                        <Link to='/dashboard?tab=profile'>
                            <Dropdown.Item className='text-lg' icon={HiViewGrid}>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item className='text-lg' onClick={handleSignout} icon={HiLogout}>Sign Out</Dropdown.Item>

                    </Dropdown>
                ) : (
                    <Link to='/sign-in' >
                        <Button gradientDuoTone='purpleToBlue' outline>
                            Sign In
                        </Button>
                    </Link>
                )}
                <Navbar.Toggle />
            </div>

            <Navbar.Collapse >
                <Navbar.Link active={path === "/"} as={'div'}>
                    <Link to='/'>
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/about"} as={'div'}>
                    <Link to='/about'>
                        About
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/search"} as={'div'} className='lg:hidden'>
                    <Link
                        to='/search'>
                        Search
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}
