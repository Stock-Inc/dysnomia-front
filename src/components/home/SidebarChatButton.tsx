"use client";
import {appStore} from "@/lib/app-store";
import classBuilder from "@/lib/classBuilder";

export default function SidebarChatButton({chatId}: {chatId: string}) {
    const store = appStore();

    return (
        <button
            className={
                classBuilder(
            `p-2 text-lg transition-all bg-card-border 
                    rounded-2xl border-2 border-card-border cursor-pointer`,
                    ["bg-light-background hover:shadow-dim-glow hover:text-shadow-white-glow hover:bg-card-border",
                    store.currentChatId !== chatId],
                    ["text-shadow-white-glow", store.currentChatId === chatId]
                )
            }
            onClick={() => store.setCurrentChatId(chatId)}
        >
            {chatId}
        </button>
    );
}