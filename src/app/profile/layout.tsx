import BackButton from "@/components/profile/BackButton";

export default function HomeLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="">
            <BackButton/>
            {children}
        </div>
    );

}