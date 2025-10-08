import {persistentStore} from "@/lib/app-store";
import React, {useEffect, useMemo, useRef, useState} from "react";
import MessageBox from "@/components/home/chat/MessageBox";
import ChatInput from "@/components/home/chat/input/ChatInput";
import useStompClient from "@/hook/useStompClient";
import classBuilder from "@/lib/classBuilder";
import ContextMenu from "@/components/home/chat/ContextMenu";
import LoadingCircles from "@/components/LoadingCircles";
import {useQuery} from "@tanstack/react-query";
import {useAnimate} from "motion/react";
import ConsoleBox from "@/components/home/chat/ConsoleBox";

export interface ChatMessage {
    id: number,
    name: string,
    message: string,
    date: number,
    reply_id: number | undefined
}
export interface ConsoleMessage {
    input: string;
    message: string;
}
export interface ChatPublishBody {
    name: string,
    message: string,
    reply_id: number,
}
export interface ConsoleCommand {
    command: string;
    description: string;
}

export default function ChatArea() {
    const {data, error, isLoading} = useQuery({
        queryKey: ["console-commands"],
        queryFn: () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/all_commands`)
            .then((res) => res.json() as unknown as ConsoleCommand[]),
    });
    
    const cachedMessages = persistentStore(state => state.cachedMessages);
    const chatId = persistentStore(state => state.currentChatId);
    const username = persistentStore(state => state.username);
    
    const chatAreaRef = useRef<null | HTMLDivElement>(null);
    const [messageToReplyTo, setMessageToReplyTo] = useState<null | ChatMessage>(null);
    const [pending, setPending] = useState(true);
    const prevMessages = useRef<(ChatMessage | ConsoleMessage)[] | null>(null);
    const [messages, publishMessage, pushMessage] = useStompClient<ChatMessage | ConsoleMessage, ChatPublishBody>(
        `${process.env.NEXT_PUBLIC_API_URL}/ws`,
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
    function onSendMessage() {
        setMessageToReplyTo(null);
        setPending(true);
    }
    function onSendCommand(message: ConsoleMessage) {
        setMessageToReplyTo(null);
        setPending(true);
        pushMessage(message);
    }
    const messageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    interface ContextMenuState {
        x: number,
        y: number,
        open: boolean,
        currentMessage: {
            element: HTMLDivElement;
            message: ChatMessage;
        },
    }
    const [contextMenuState, setContextMenuState] = useState<ContextMenuState | null>(null);
    const contextMenuRef = useRef<null | HTMLDivElement>(null);
    const [scope, animate] = useAnimate();
    const messagesToRender = useMemo(() => {
        const result: React.ReactNode[] = [];
        if (messages === null && !cachedMessages[chatId]) return null;
        else {
            (messages ?? cachedMessages[chatId]).forEach((message) => {
                if ("id" in message) {
                    result.push(
                        <MessageBox
                            ref={(e) => {
                                messageRefs.current.set(message.id, e!);
                            }}
                            doubleClickHandler={() => setMessageToReplyTo(message)}
                            scrollToOriginal={() => {
                                if (message.reply_id && messageRefs.current.get(message.reply_id)) {
                                    const targetY = (messageRefs.current.get(message.reply_id)?.offsetTop ?? 0) + 42
                                        - window.innerHeight / 2;
                                    const scrollDiff = Math.abs(targetY - (chatAreaRef.current?.scrollTop ?? 0));
                                    chatAreaRef.current?.scrollTo({
                                        top: targetY,
                                        behavior: "smooth",});
                                    animate(
                                        document.querySelector(`.msgbg${message.reply_id}`)!,
                                        {backgroundColor: ["#9393a1", "rgba(128,140,193, 0)"]},
                                        {duration: 0.5, delay: scrollDiff * 0.0005},
                                    );
                                }
                            }}
                            contextHandler={(e) => {
                                setContextMenuState(s => {
                                    const currentMessage = {
                                        element: messageRefs.current.get(message.id)!,
                                        message
                                    };
                                    let deltaX = 0;
                                    let deltaY = 0;
                                    const chatAreaRect = chatAreaRef.current!.getBoundingClientRect();
                                    const ctx = contextMenuRef.current!;
                                    if (chatAreaRect.bottom - e.clientY < ctx.clientHeight) {
                                        deltaY = ctx.clientHeight;
                                    }
                                    if (chatAreaRect.right - e.clientX < ctx.clientWidth) {
                                        deltaX = ctx.clientWidth;
                                    }
                                    return s?.open ? {
                                        x: s.x,
                                        y: s.y,
                                        open: false,
                                        currentMessage
                                    } : {
                                        x: e.clientX - deltaX,
                                        y: e.clientY - deltaY,
                                        open: true,
                                        currentMessage
                                    };
                                });
                            }}
                            key={message.id}
                            isOuter={username !== message.name}
                            message={message}
                        />
                    );
                } else {
                    result.push(
                        <ConsoleBox key={`${result.length} ${message.input}`} input={message.input} output={message.message} />
                    );
                }
            });
        }
        return result;
    }, [messages, username, animate, cachedMessages, chatId]);

    useEffect(() => {
        if (!messages) return;
        persistentStore.getState().setCachedMessages(chatId, messages!);
    }, [messages, chatId]);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (contextMenuState?.open) {
                const rect = contextMenuRef.current!.getBoundingClientRect();
                if (e.x > rect.right || e.x < rect.left || e.y > rect.top || e.y < rect.bottom) {
                    setContextMenuState(s => s ? {
                            ...s, open: false
                        } : null
                    );
                }
            }
        }
        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, [contextMenuState]);

    useEffect(() => {
        if (chatAreaRef.current) chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }, [chatId]);

    useEffect(() => {
        if (!chatAreaRef.current || !pending || messages === prevMessages.current) return;
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        prevMessages.current = messages;
        setPending(false);
    }, [messages, pending, prevMessages]);

    return (
            <>
                <div
                    ref={chatAreaRef}
                    className={
                        classBuilder(
                            `bg-chat-background max-md:border-t-2 md:border-x-2 border-card-border 
                            space-y-2 h-screen flex flex-col justify-between
                            [&::-webkit-scrollbar-track]:border-card-border
                            [&::-webkit-scrollbar-thumb]:hover:bg-accent [&::-webkit-scrollbar-thumb]:transition-all
                            [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:rounded-full 
                            [&::-webkit-scrollbar-track]:bg-light-background [&::-webkit-scrollbar-thumb]:rounded-full 
                            [&::-webkit-scrollbar-thumb]:bg-card-border [&::-webkit-scrollbar-track]:border-l-2`,
                            [contextMenuState?.open, "overflow-y-hidden pr-3"],
                            [!contextMenuState?.open, "overflow-y-scroll"],
                            [!messagesToRender, "justify-center"]
                        )
                    }
                >
                    {messagesToRender &&
                        <div ref={scope} className={"flex flex-col space-y-2 py-2"}>
                            {messagesToRender}
                        </div>
                    }
                    {
                        !messagesToRender && <LoadingCircles/>
                    }

                </div>
                <ChatInput
                    publishMessageAction={publishMessage}
                    username={username}
                    replyId={messageToReplyTo?.id ?? 0}
                    onSendMessageAction={onSendMessage}
                    onCommandSendAction={onSendCommand}
                    cancelReplyAction={() => setMessageToReplyTo(null)}
                    messageToReplyTo={messageToReplyTo}
                    isLoading={messagesToRender === null}
                    consoleCommands={isLoading ? null : error ? [] : data as ConsoleCommand[]}
                />
                <ContextMenu
                    ref={contextMenuRef}
                    state={contextMenuState}
                    replyAction={() => {
                        setMessageToReplyTo(contextMenuState?.currentMessage.message ?? null);
                    }}
                    forwardAction={() => {
                        //TODO: implement
                    }}
                    copyAction={() => {
                        navigator.clipboard.writeText(contextMenuState?.currentMessage.message.message ?? "");
                    }}
                    pinAction={() => {
                        //TODO: implement
                    }}
                    deleteAction={() => {
                        //TODO: implement
                    }}
                />
            </>
    );
}