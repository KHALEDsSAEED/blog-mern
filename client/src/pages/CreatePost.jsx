import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';


export default function () {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});

    const handleUpdloadImage = async () => {
        try {
            if (!file) {
                setImageUploadError('Please select an image');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError('Image upload failed');
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        } catch (error) {
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
            console.log(error);
        }
    };

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
            <form className='flex flex-col gap-4'>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput className='flex-1' type='text' placeholder='title' required id='title' />
                    <Select>
                        <option value='uncategorized'>Select a category</option>
                        <option value='javascript'> JavaScript</option>
                        <option value='reactjs'>React.JS</option>
                        <option value='nextjs'>Next.JS</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-start justify-between border-4 border-dotted p-3 border-teal-500">
                    <div className=" flex-col w-[75%]">
                    <FileInput type='file' accept='image/*'  onChange={(e) => {
                        setFile(e.target.files[0]);
                    }} />
                    {formData.image && (<img src={formData.image} alt='post' className=' mt-2 w-full h-64 object-contain border-2 border-teal-300' />)}
                    </div>

                    <Button onClick={handleUpdloadImage} disabled={imageUploadProgress} type='button' outline gradientDuoTone='purpleToBlue' size='sm'>
                        {imageUploadProgress ? (<div className='w-16 h-16'> <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} /></div>) : ('Upload Image')}
                    </Button>
                </div>

                {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                <ReactQuill theme="snow" placeholder='Write something...' className=' h-60 mb-12' />
                <Button type='submit' className=' mb-3' outline gradientDuoTone='purpleToPink'>Publish</Button>

            </form>
        </div>
    )
}
