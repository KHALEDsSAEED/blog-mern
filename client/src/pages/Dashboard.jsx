import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";

export default function Dashboard() {
    const location = useLocation();
    const [tab, setTab] = useState("");
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromURL = urlParams.get("tab");
        if (tabFromURL) {
            setTab(tabFromURL);
        }
    }, [location]);
    return (
        <div className="min-h-screen flex flex-col md:flex-row ">
            <div className="md:w-56">
                <DashSidebar />
            </div>
            {tab === "profile" && <DashProfile />}
            {tab === "posts" && <DashPosts/>}
        </div>
    )
}
