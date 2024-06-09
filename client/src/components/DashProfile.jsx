import { Alert, Button, TextInput } from "flowbite-react"
import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { getDownloadURL } from "firebase/storage";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure, updateStart, updateSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";


export default function DashProfile() {
    const { currentUser } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileURL, setImageFileURL] = useState(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null); // progress percentage
    const [imageFileUploadingError, setImageFileUploadingError] = useState(null); // error message
    const [formData, setFormData] = useState({}); // { username: '', email: '', password: '' }
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState(''); // 'success' or 'error'



    const filePickerRef = useRef();
    const dispatch = useDispatch();


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileURL(URL.createObjectURL(file));
        }

    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);



    useEffect(() => {
        if (updateUserError || updateUserSuccess || imageFileUploadingError) {
            setShowToast(true);
            setToastMessage(updateUserError || updateUserSuccess || imageFileUploadingError);
            setToastType(updateUserError || imageFileUploadingError ? 'error' : 'success');
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 5000); // Set duration in milliseconds (5000ms = 5 seconds)
            return () => clearTimeout(timer);
        }
    }, [updateUserError, updateUserSuccess, imageFileUploadingError]);

    // service firebase.storage {
    //     match /b/{bucket}/o {
    //       match /{allPaths=**} {
    //         allow read;
    //         allow write: if
    //         request.resource.size < 2 * 1024 * 1024 && // 2MB
    //         request.resource.contentType.matches('image/.*');
    //       }
    //     }
    //   }

    const uploadImage = async () => {
        setImageFileUploadingProgress(true);
        setImageFileUploadingError(null);
        try {
            const storage = getStorage(app);
            const filName = new Date().getTime() + imageFile.name; // unique file name
            const storageRef = ref(storage, filName);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageFileUploadingProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageFileUploadingError('Could not upload the image! Large File size.'); // error.message
                    setImageFileUploadingProgress(null);
                    setImageFile(null);
                    setImageFileURL(null);
                    setImageFileUploading(false);
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageFileURL(downloadURL);
                        setFormData({ ...formData, profilePicture: downloadURL });
                        setImageFileUploading(false);
                    });
                }
            );

        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if (Object.keys(formData).length === 0) {
            setUpdateUserError('No changes made');
            return;
        }
        if (imageFileUploading) {
            setUpdateUserError('Please wait for image to upload');
            return;
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("Profile updated successfully");
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };




    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semiblod text-3xl">Profile</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                <input hidden type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} />

                <div className="relative w-32 h-32 self-center cursor-pointer overflow-hidden rounded-full shadow-md" onClick={() => filePickerRef.current.click()}>

                    {imageFileUploadingProgress && (
                        <CircularProgressbar
                            value={imageFileUploadingProgress || 0}
                            text={`${imageFileUploadingProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(62, 152, 199, ${imageFileUploadingProgress / 100
                                        })`,
                                },
                            }}
                        />
                    )}

                    <img src={imageFileURL || currentUser.profilePicture} alt="user profile"
                        className={`rounded-full object-cover
                        w-full h-full border-8 border-[lightgray] 
                        ${imageFileUploadingProgress && imageFileUploadingProgress < 100 && 'opacity-60'}`} />
                </div>

                {showToast && (
                    <Toast className='absolute top-20 right-3'>
                        <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toastType === 'error' ? 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200' : 'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'}`}>
                            {toastType === 'error' ? <HiX className="h-5 w-5" /> : <HiCheck className="h-5 w-5" />}
                        </div>
                        <div className="ml-3 text-sm font-normal">{toastMessage}</div>
                        <Toast.Toggle onClick={() => setShowToast(false)} />
                    </Toast>
                )}

                <TextInput
                    type='text'
                    id='username'
                    placeholder='username'
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput
                    type='email'
                    id='email'
                    placeholder='email'
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput
                    type='password'
                    id='password'
                    placeholder='password'
                    onChange={handleChange}
                />

                <Button type="submit" outline gradientDuoTone='purpleToBlue'>Update</Button>

                <div className="text-red-500 flex justify-between mt-5">
                    <span className="cursor-pointer">Delete Account</span>
                    <span className="cursor-pointer">sign Out</span>
                </div>

                {showToast && (
                    <Toast className='absolute top-20 right-3'>
                        <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toastType === 'error' ? 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200' : 'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'}`}>
                            {toastType === 'error' ? <HiX className="h-5 w-5" /> : <HiCheck className="h-5 w-5" />}
                        </div>
                        <div className="ml-3 text-sm font-normal">{toastMessage}</div>
                        <Toast.Toggle onClick={() => setShowToast(false)} />
                    </Toast>
                )}

                {showToast && (
                    <Toast className='absolute top-20 right-3'>
                        <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toastType === 'error' ? 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200' : 'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'}`}>
                            {toastType === 'error' ? <HiX className="h-5 w-5" /> : <HiCheck className="h-5 w-5" />}
                        </div>
                        <div className="ml-3 text-sm font-normal">{toastMessage}</div>
                        <Toast.Toggle onClick={() => setShowToast(false)} />
                    </Toast>
                )}

            </form>
        </div>
    )
}
