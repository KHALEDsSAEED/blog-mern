import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';

export default function () {
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
                    <FileInput type='file' accept='image/*' />
                    <Button type='button' outline gradientDuoTone='purpleToBlue' size='sm'>Upload Image</Button>
                </div>
                <ReactQuill theme="snow" placeholder='Write something...' className=' h-60 mb-12' />
                <Button type='submit' outline gradientDuoTone='purpleToPink'>Publish</Button>

            </form>
        </div>
    )
}
