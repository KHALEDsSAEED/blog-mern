import { Button, TextInput } from "flowbite-react"
import { useSelector } from "react-redux"

export default function DashProfile() {
    const { currentUser } = useSelector(state => state.user)
    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semiblod text-3xl">Profile</h1>
            <form className="flex flex-col gap-4">
                <div className="w-32 h-32 self-center cursor-pointer overflow-hidden rounded-full shadow-md">
                    <img src={currentUser.profilePicture} alt="user profile" className="rounded-full object-cover w-full h-full border-8 border-[lightgray]" />
                </div>
                <TextInput type="text" id="username" placeholder="username" value={currentUser.username} />
                <TextInput type="email" id="email" placeholder="email" value={currentUser.email} />
                <TextInput type="password" id="password" placeholder="password" />
                <Button type="submit" outline gradientDuoTone='purpleToBlue'>Update</Button>
                <div className="text-red-500 flex justify-between mt-5">
                    <span>Delete Account</span>
                    <span>sign Out</span>
                </div>
            </form>
        </div>
    )
}
