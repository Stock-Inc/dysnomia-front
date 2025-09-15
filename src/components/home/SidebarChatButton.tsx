"use client";
import {appStore} from "@/lib/app-store";

export default function SidebarChatButton({chatId}: {chatId: string}) {
    const store = appStore();

    return (
        <button className={`p-2 text-lg transition-all ${store.currentChatId === chatId ? 
            "bg-card-border text-shadow-white-glow" :
            "bg-light-background hover:shadow-dim-glow hover:text-shadow-white-glow hover:bg-card-border"} 
        rounded-2xl border-2 border-card-border cursor-pointer`}
                onClick={() => store.setCurrentChatId(chatId)}>
            {chatId}
        </button>
    );
}