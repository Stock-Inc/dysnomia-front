"use client";
import ChatArea from "@/components/home/chat/ChatArea";
import {persistentStore} from "@/lib/app-store";
import {useEffect} from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import {QueryClient} from "@tanstack/query-core";
import ChatInfoBar from "@/components/home/ChatInfoBar";

export default function Page() {

    const store = persistentStore();

    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape" && store.isSidebarOpen) store.setCurrentChatId("");
        }
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [store]);

    const queryClient = new QueryClient();

    return (
        <div className={`h-screen transition-all max-md:pt-21 md:pr-21 font-main flex flex-col justify-center w-full`}>
            <QueryClientProvider client={queryClient}>
                {store.currentChatId && <ChatInfoBar chatId={store.currentChatId}/>}
            </QueryClientProvider>
            <QueryClientProvider client={queryClient}>
                <ChatArea />
            </QueryClientProvider>
        </div>

    );
}