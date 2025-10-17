"use client";
import LocalProfileDetails from "@/components/profile/LocalProfileDetails";
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";

export default function Page() {

    const queryClient = new QueryClient();

    return (
        <div>
            <h1 className={"text-center text-3xl mb-4"}>My Profile</h1>
            <QueryClientProvider client={queryClient}>
                <LocalProfileDetails/>
            </QueryClientProvider>
        </div>
    );
}