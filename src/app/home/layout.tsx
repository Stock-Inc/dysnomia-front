"use client";
import ProfileModal from "@/components/home/ProfileModal";
import NoSSR from "@/components/NoSSR";
import Sidebar from "@/components/home/Sidebar";
import {QueryClientProvider} from "@tanstack/react-query";
import {QueryClient} from "@tanstack/query-core";

export default function HomeLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    const client = new QueryClient();
    return (
        <NoSSR>
            <div className="flex">
                <QueryClientProvider client={client}>
                    <Sidebar/>
                </QueryClientProvider>
                <ProfileModal/>
                {children}
            </div>
        </NoSSR>
    );

}