"use client";
import ChatArea from "@/components/home/ChatArea";
import {appStore} from "@/lib/app-store";
import {useEffect} from "react";

export default function Page() {

    const store = appStore();

    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape" && store.isSidebarOpen) store.setCurrentChatId("");
        }
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [store.isSidebarOpen]);

    return (
        <div className={`h-screen transition-all max-sm:pt-21 sm:pr-21 sm:pl-21 font-main flex flex-col justify-center`}>
            <ChatArea />
        </div>

    );
}