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
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';



export default function UpdatePost() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publichError, setPublishError] = useState(null);
    const { postId } = useParams();

    const currentUser = useSelector((state) => state.user.currentUser);

    //console.log(postId);


    const navigate = useNavigate();

    useEffect(() => {
        try {
            const fetchPost = async () => {
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                    setPublishError(data.message);
                    return;
                }
                if (res.ok) {
                    setFormData(data.posts[0]);
                    setPublishError(null);
                }
            }
            fetchPost();
        }
        catch (error) {
            console.log(error.message);
        }
    }, [postId]);



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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }

            if (res.ok) {
                setPublishError(null);
                navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            setPublishError('Something went wrong');
        }
    };
    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Update a post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput value={formData.title} className='flex-1' type='text' placeholder='title' required id='title' onChange={
                        (e) => setFormData({ ...formData, title: e.target.value })
                    } />
                    <Select onChange={(e) => {
                        setFormData({ ...formData, category: e.target.value })
                    }} value={formData.category}>
                        <option value='uncategorized'>Select a category</option>
                        <option value='javascript'> JavaScript</option>
                        <option value='reactjs'>React.JS</option>
                        <option value='nextjs'>Next.JS</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-start justify-between border-4 border-dotted p-3 border-teal-500">
                    <div className=" flex-col w-[75%]">
                        <FileInput type='file' accept='image/*' onChange={(e) => {
                            setFile(e.target.files[0]);
                        }} />
                        {formData.image && (<img src={formData.image} alt='post' className=' mt-2 w-full h-64 object-contain border-2 border-teal-300' />)}
                    </div>

                    <Button onClick={handleUpdloadImage} disabled={imageUploadProgress} type='button' outline gradientDuoTone='purpleToBlue' size='sm'>
                        {imageUploadProgress ? (<div className='w-16 h-16'> <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} /></div>) : ('Upload Image')}
                    </Button>
                </div>

                {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                <ReactQuill value={formData.content} theme="snow" placeholder='Write something...' className=' h-60 mb-12' onChange={
                    (value) => setFormData({ ...formData, content: value })
                } />
                <Button type='submit' className=' mb-3' outline gradientDuoTone='purpleToPink'>Update</Button>
                {publichError && <Alert color='failure'>{publichError}</Alert>}
            </form>
        </div>
    )
}
