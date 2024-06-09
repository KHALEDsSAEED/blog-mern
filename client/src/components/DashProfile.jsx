import { Alert, Button, TextInput } from "flowbite-react"
import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { getDownloadURL } from "firebase/storage";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { set } from "mongoose";


export default function DashProfile() {
    const { currentUser } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileURL, setImageFileURL] = useState(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null); // progress percentage
    const [imageFileUploadingError, setImageFileUploadingError] = useState(null); // error message
    const filePickerRef = useRef();

    //console.log(imageFileUploadingProgress, imageFileUploadingError);

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
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageFileURL(downloadURL);
                    });
                }
            );

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semiblod text-3xl">Profile</h1>
            <form className="flex flex-col gap-4">

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

                {imageFileUploadingError && <Alert color="failure">{imageFileUploadingError}</Alert>}

                <TextInput type="text" id="username" placeholder="username" value={currentUser.username} />
                <TextInput type="email" id="email" placeholder="email" value={currentUser.email} />
                <TextInput type="password" id="password" placeholder="password" />

                <Button type="submit" outline gradientDuoTone='purpleToBlue'>Update</Button>

                <div className="text-red-500 flex justify-between mt-5">
                    <span className="cursor-pointer">Delete Account</span>
                    <span className="cursor-pointer">sign Out</span>
                </div>
            </form>
        </div>
    )
}
