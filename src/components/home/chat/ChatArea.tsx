import {persistentStore} from "@/lib/app-store";
import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import MessageBox from "@/components/home/chat/MessageBox";
import {X} from "lucide-react";
import ChatInput from "@/components/home/chat/ChatInput";
import useStompClient from "@/hook/useStompClient";
import classBuilder from "@/lib/classBuilder";
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";
import {useAnimate} from "motion/react";
import {AnimationPlaybackControlsWithThen} from "motion";

export interface ChatMessage {
    id: number,
    name: string,
    message: string,
    date: number,
    reply_id: number | undefined
}
export interface ChatPublishBody {
    name: string,
    message: string,
    reply_id: number,
}

export default function ChatArea() {
    const store = persistentStore();
    const chatAreaRef = useRef<null | HTMLDivElement>(null);
    const [replyId, setReplyId] = useState(0);
    const [messageToReplyTo, setMessageToReplyTo] = useState<undefined | ChatMessage>(undefined);
    const [pending, setPending] = useState(true);
    const [prevMessages, setPrevMessages] = useState<ChatMessage[] | null>(null);
    const queryClient = new QueryClient();
    const [messages, publishMessage] = useStompClient<ChatMessage, ChatPublishBody>(`${process.env.NEXT_PUBLIC_API_URL}/ws`,
        {
            reconnectDelay: 5000,
            debugHandler: (str) => console.log(str),
            onConnect: (f) => {
                console.log("Connected");
                console.log(f);
            },
            onError: (err) => console.log(err),
            onDisconnect: (f) => {
                console.log(f);
            },
        }
    );
    const messageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const messagesToRender = useMemo(() => {
        const result: React.ReactNode[] = [];
        if (messages === null) return [null, null];
        else {
            messages.forEach((message) => {
                result.push(
                    <MessageBox
                        ref={(e) => {
                            messageRefs.current.set(message.id, e!);
                        }}
                        doubleClickHandler={() => setReplyId(message.id)}
                        scrollToOriginal={() => {
                            if (message.reply_id && messageRefs.current.get(message.reply_id)) {
                                chatAreaRef.current?.scrollTo({
                                    top: messageRefs.current.get(message.reply_id)!.offsetTop - window.innerHeight / 2,
                                    behavior: "smooth",
                                });
                            }
                        }}
                        key={message.id}
                        isOuter={store.username !== message.name}
                        message={message}
                    />
                );
            });
        }
        return result;
    }, [messages, store.username]);

    useEffect(() => {
        if (chatAreaRef.current) chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }, [store.currentChatId]);

    useEffect(() => {
        setMessageToReplyTo(messages?.find((msg) => msg.id === replyId));
    }, [replyId, messages]);

    useEffect(() => {
        if (!chatAreaRef.current || !pending || messages === prevMessages) return;
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        setPrevMessages(messages);
        setPending(false);
    }, [messages, pending, prevMessages]);

    function onSendMessage() {
        setReplyId(0);
        setPending(true);
    }

    return (
        store.currentChatId ?
            <>
                <div ref={chatAreaRef} className={
                    classBuilder(
                        `bg-chat-background max-sm:border-t-2 sm:border-x-2 border-card-border 
                        space-y-2 h-screen overflow-y-scroll [&::-webkit-scrollbar-track]:border-card-border flex flex-col justify-between
                        [&::-webkit-scrollbar-thumb]:hover:bg-accent [&::-webkit-scrollbar-thumb]:transition-all
                        [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-light-background
                        [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-card-border [&::-webkit-scrollbar-track]:border-l-2`,
                        ["max-md:hidden", store.isSidebarOpen],
                        ["justify-center", !messages]
                    )
                }>
                    {!(messages === null) &&
                        <QueryClientProvider client={queryClient}>
                            <div className={"flex flex-col p-4 space-y-2"}>
                                {messagesToRender}
                            </div>
                        </QueryClientProvider>
                    }
                    {
                        messages === null &&
                        <div className={"flex flex-col sticky w-full justify-center"}>
                            <div className={"self-center animate-loading-circle p-10 border-4 border-loading-circle rounded-full absolute"}/>
                            <div className={"self-center opacity-0 animate-[loadingCircle_1s_ease-in-out_0.5s_infinite]" +
                                " p-10 border-4 border-loading-circle rounded-full"}/>
                        </div>
                    }

                </div>
                <div className={`${messages === null && "hidden"} sticky bottom-0 w-full left-0 h-fit flex flex-col group`}>
                    <div className={`${!replyId && "hidden"} line-clamp-1 border-t-2 sm:border-2 sm:border-b-0 
                    border-card-border group-has-focus:border-accent bg-light-background flex justify-between transition-all`}>
                        <div className={"flex space-x-2 p-2"}>
                            <p className={"text-lg"}>{messageToReplyTo?.name === "" ? "anon" : messageToReplyTo?.name}:</p>
                            <q className={"text-sm place-self-center"}>{messageToReplyTo?.message}</q>
                        </div>
                        <button aria-label={"Cancel reply"} onClick={() => setReplyId(0)}
                                className={`place-self-center cursor-pointer transition-all focus:outline-none hover:text-accent
                                hover:bg-card-border focus:text-accent focus:bg-card-border h-full aspect-square`}>
                            <X className={"place-self-center"}/>
                        </button>
                    </div>
                    <ChatInput
                        publishMessageAction={publishMessage}
                        username={store.username}
                        replyId={replyId}
                        onSendMessageAction={onSendMessage}
                    />
                </div>
            </>
            :
            <h1 className="place-self-center text-2xl justify-self-center">Select a chat to open it</h1>

    );
}