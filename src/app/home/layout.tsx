import Sidebar from "@/components/home/Sidebar";
import ProfileModal from "@/components/home/ProfileModal";

export default function HomeLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex">
            <Sidebar/>
            <ProfileModal/>
            {children}
        </div>
    );

}