"use client";
import {persistentStore} from "@/lib/app-store";
import classBuilder from "@/lib/classBuilder";
import {useEffect, useMemo, useState} from "react";
import {ChatMessage, ConsoleMessage} from "@/components/home/chat/ChatArea";

export default function SidebarChatButton({chatId}: {chatId: string}) {
    const [prevMessage, setPrevMessage] = useState<null | ChatMessage | ConsoleMessage>(null);
    const chatMessages = persistentStore(state => state.cachedMessages[chatId]);
    const currentChatId = persistentStore(state => state.currentChatId);
    const senderName = useMemo(() => {
        if (!prevMessage) return "Loading...";
        if ("name" in prevMessage) {
            return prevMessage.name.length > 0 ? prevMessage.name : "anon" ;
        } else return "console";
    }, [prevMessage]);
    useEffect(() => {
        if (!chatMessages) return;
        setPrevMessage(chatMessages[chatMessages.length - 1]);
    }, [chatId, chatMessages]);

    return (
        <button
            className={
                classBuilder(
            `p-2 px-4 text-lg text-start transition-all bg-card-border border-b-2 border-card-border cursor-pointer focus:outline-none group`,
                    [currentChatId !== chatId, "bg-light-background hover:shadow-dim-glow hover:bg-card-border"],
                )
            }
            onClick={() => persistentStore.getState().setCurrentChatId(chatId)}
        >
            <h4 className={classBuilder(
                "transition-all text-xl",
                [currentChatId === chatId, "text-white"],
            )}>{chatId}</h4>
            <div className={`${currentChatId !== chatId && "text-muted-foreground"} flex space-x-2`}>
                <p className={`${currentChatId === chatId}`}>
                    {
                        senderName + ":"
                    }
                </p>
                <span className={"wrap-anywhere line-clamp-1"}>{prevMessage?.message}</span>
            </div>
        </button>
    );
}