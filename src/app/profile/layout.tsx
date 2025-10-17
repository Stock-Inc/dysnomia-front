"use client";
import BackButton from "@/components/profile/BackButton";
import NoSSR from "@/components/NoSSR";

export default function HomeLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <NoSSR>
            <div>
                <BackButton/>
                <div className={"h-screen flex flex-col justify-center items-center font-main"}>
                    <div className={"p-8 bg-light-background border-2 border-card-border rounded-2xl flex flex-col space-y-4"}>
                        {children}
                    </div>
                </div>
            </div>
        </NoSSR>
    );

}