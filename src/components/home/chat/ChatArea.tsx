import {appStore} from "@/lib/app-store";
import SockJS from "sockjs-client";
import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";
import MessageBox from "@/components/home/chat/MessageBox";
import {X} from "lucide-react";
import ChatInput from "@/components/home/chat/ChatInput";

export interface ChatMessage {
    id: number,
    name: string,
    message: string,
    date: number,
    reply_id: number | undefined
}

export default function ChatArea() {
    const store = appStore();
    const stompClient = useRef<Client | null>(null);
    const chatAreaRef = useRef<null | HTMLDivElement>(null);
    const textareaRef = useRef<null | HTMLTextAreaElement>(null);
    const [messages, setMessages] = useState<undefined|ChatMessage[]>(undefined);
    const [input, setInput] = useState("");
    const [replyId, setReplyId] = useState(0);
    const [messageToReplyTo, setMessageToReplyTo] = useState<undefined | ChatMessage>(undefined);

    useEffect(() => {
        //TODO: caching, suspense ui, prolly put it on serverside
        stompClient.current = new Client({
            webSocketFactory: () => new SockJS("https://api.femboymatrix.su/ws"),
            reconnectDelay: 5000,
            debug: (str) => console.log(str),

            onConnect: (frame) => {
                console.log("Connection established");
                console.log(frame);

                stompClient.current!.subscribe("/topic/message",
                    (message) => {
                        const parsedMessage: ChatMessage = JSON.parse(message.body);
                        setMessages(m => [...(m ?? []), parsedMessage]);
                    });

                stompClient.current!.subscribe("/topic/history",
                    (message) => {
                        const parsedMessages: ChatMessage[] = JSON.parse(message.body);
                        setMessages(parsedMessages.reverse());
                    });

                stompClient.current!.publish({destination: "/app/history", body: JSON.stringify([]), headers: {'content-type': 'application/json'}});
            },

            onStompError: (frame) => {
                console.log(`Error: ${frame}`);
            }
        });

        stompClient.current.activate();

    }, []);

    useEffect(() => {
        setMessageToReplyTo(messages?.find((msg) => msg.id === replyId));
    }, [replyId, messages]);

    function sendMessage() {
        stompClient.current!.publish(
            {
                destination: "/app/chat",
                body: JSON.stringify({
                    name: store.username,
                    message: input,
                    reply_id: replyId,
                }),
                headers: {
                    "content-type": "application/json",
                },
            }
        );
        setInput("");
        setReplyId(0);
        textareaRef.current!.rows = 1;
        chatAreaRef.current!.scrollTop = chatAreaRef.current!.scrollHeight;
    }

    function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && e.shiftKey) return;
        if (e.key === "Enter" && input.trim() !== "") {
            e.preventDefault();
            sendMessage();
        }
    }

    function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setInput(e.currentTarget.value);
        if (textareaRef.current!.value.split("\n").length <= 5) {
            textareaRef.current!.rows = 1 + textareaRef.current!.value.split("\n").length;
        }
    }

    return (
        store.currentChatId ?
            <div ref={chatAreaRef} className={`bg-chat-background max-sm:border-t-2 sm:border-x-2 border-card-border
             space-y-2 h-screen overflow-y-scroll [&::-webkit-scrollbar-track]:border-card-border flex flex-col justify-between
             [&::-webkit-scrollbar-thumb]:hover:bg-accent [&::-webkit-scrollbar-thumb]:transition-all
             [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-light-background
             [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-card-border [&::-webkit-scrollbar-track]:border-l-2
             ${store.isSidebarOpen && "max-md:hidden"}`}>
                <div className={"flex flex-col p-4 space-y-2"}>
                    {
                        messages?.map((message) =>
                            <MessageBox
                                doubleClickHandler={() => setReplyId(message.id)}
                                key={message.id}
                                isOuter={store.username !== message.name}
                                message={message}/>
                        )
                    }
                </div>
                <div className={`sticky bottom-0 w-full left-0 h-fit flex flex-col group ${!messages && "hidden"}`}>
                    <div className={`${!replyId && "hidden"} line-clamp-1 border-t-2 border-card-border group-has-focus:border-accent
                    bg-light-background flex justify-between transition-all`}>
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
                        taValue={input}
                        taRef={textareaRef}
                        taKeyDownAction={handleKeyPress}
                        taChangeAction={handleInputChange}
                        sendButtonAction={sendMessage}
                    />
                </div>

            </div>
            :
            <h1 className="place-self-center text-2xl justify-self-center">Select a chat to open it</h1>

    );
}