import Sidebar from "@/components/home/Sidebar";
import ProfileButton from "@/components/home/ProfileButton";

export default function HomeLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="">
            <Sidebar/>
            <ProfileButton/>
            {children}
        </div>
    );

}