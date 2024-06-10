import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Label, Spinner, TextInput, Alert } from 'flowbite-react'
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { HiEye } from 'react-icons/hi';




export default function Signin() {
    const [formData, setFormData] = useState({});
    const { loading, error: errorMessage } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value.trim()
        });
    }

    const resetPassword = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            sendPasswordResetEmail(auth, formData.email)
                .then(() => {
                    // Password reset email sent!
                    navigate('/sign-in');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });
        }
        catch (err) {
            console.error(err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent the page from refreshing
        if (!formData.email || !formData.password) {
            return dispatch(signInFailure('Please fill in all the fields'));
        }

        /*
        const auth = getAuth();

        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Check if email is verified
        if (!user.emailVerified) {
            return dispatch(signInFailure('Please verify your email'));
        }
        */

        try {
            dispatch(signInStart());
            const res = await fetch('api/auth/signin', {
                method: 'POST', // send data to the server
                headers: {
                    'Content-Type': 'application/json'
                }, // tell the server that we are sending json data
                body: JSON.stringify(formData) // convert the object to a string
            });
            const data = await res.json(); // convert the response to json
            if (data.sucess === false) {
                dispatch(signInFailure(data.message));
            }
            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            }
        }
        catch (err) {
            dispatch(signInFailure(err.message));
        }
    }

    return (
        <div className='min-h-screen mt-20'>
            <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">

                {/*left side */}
                <div className="flex-1">
                    <Link to='/' className='font-bold dark:text-white text-4xl'>
                        <span className='px-2 mr-1 py-1 bg-gradient-to-r text-white
                        from-indigo-500 via-purple-500 to-pink-500 rounded-lg'>
                            Khaled's
                        </span>
                        Blog
                    </Link>
                    <p className='text-sm mt-5'>
                        Welcome to my blog, please sign in with your email and password to continue
                    </p>
                </div>

                {/*right side */}
                <div className="flex-1">
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div>
                            <Label value='Your Email' />
                            <TextInput
                                type='email'
                                placeholder='Email'
                                id='email'
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label value='Your Password' />
                            <TextInput
                                type='password'
                                placeholder='*********'
                                id='password'
                                onChange={handleChange}
                            />
                        </div>
                        <Button gradientDuoTone='purpleToPink' className='hover:scale-105' type='submit' disabled={loading}>
                            {
                                loading ? (
                                    <>
                                        <Spinner size='sm' />
                                        <span className='pl-3'>Loading...</span>
                                    </>
                                ) : 'Sign In'

                            }
                        </Button>
                        <OAuth />
                        {/*
                        <Button type='button' className="hover:scale-105" outline gradientDuoTone='pinkToOrange' onClick={resetPassword}>
                            FORGET YOUR PASSWORD?
                        </Button>
                        */}
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Dont have an account ?</span>
                        <Link to='/sign-up' className='text-blue-500'>
                            Sign Up
                        </Link>
                    </div>

                    {
                        errorMessage && (
                            <Alert className='mt-5 text-xl' color='failure'>
                                {errorMessage}
                            </Alert>
                        )
                    }

                </div>
            </div>
        </div>

    )
}
