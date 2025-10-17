"use client";
import ProfileDetails from "@/components/profile/ProfileDetails";
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";

export default function Page() {

    const queryClient = new QueryClient();

    return (
        <>
            <h1 className={"text-center text-3xl"}>Profile</h1>
            <QueryClientProvider client={queryClient}>
                <ProfileDetails />
            </QueryClientProvider>
        </>
    );
}