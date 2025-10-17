"use client";
import ProfileModal from "@/components/home/ProfileModal";
import NoSSR from "@/components/NoSSR";
import Sidebar from "@/components/home/Sidebar";

export default function HomeLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <NoSSR>
            <div className="flex">
                <Sidebar/>
                <ProfileModal/>
                {children}
            </div>
        </NoSSR>
    );

}