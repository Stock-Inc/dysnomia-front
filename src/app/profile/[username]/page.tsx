"use client";
import ProfileDetails from "@/components/profile/ProfileDetails";
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";

export default function Page() {

    const queryClient = new QueryClient({defaultOptions: {
            queries: {

            }
        }});

    return (
        <div className={"h-screen flex flex-col justify-center items-center font-main"}>
            <div className={"p-8 bg-light-background border-2 border-card-border rounded-2xl flex flex-col space-y-4"}>
                <h1 className={"text-center text-3xl"}>Profile</h1>
                <QueryClientProvider client={queryClient}>
                    <ProfileDetails />
                </QueryClientProvider>
            </div>
        </div>
    );
}