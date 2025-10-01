"use client";
import ChatArea from "@/components/home/chat/ChatArea";
import {persistentStore} from "@/lib/app-store";
import {useEffect} from "react";
import {QueryClientProvider, useQueryClient} from "@tanstack/react-query";
import {QueryClient} from "@tanstack/query-core";

export default function Page() {

    const store = persistentStore();

    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape" && store.isSidebarOpen) store.setCurrentChatId("");
        }
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [store.isSidebarOpen]);

    const queryClient = new QueryClient();

    return (
        <div className={`h-screen transition-all max-sm:pt-21 sm:pr-21 sm:pl-21 font-main flex flex-col justify-center`}>
            <QueryClientProvider client={queryClient}>
                <ChatArea />
            </QueryClientProvider>
        </div>

    );
}