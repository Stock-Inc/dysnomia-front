import {appStore} from "@/lib/app-store";
import SockJS from "sockjs-client";
import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";
import MessageBox from "@/components/home/MessageBox";
import {SendHorizonal} from "lucide-react";

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
    const textareaRef = useRef<null | HTMLTextAreaElement>(null);
    const [messages, setMessages] = useState<undefined|ChatMessage[]>(undefined);
    const [input, setInput] = useState("");

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

    function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && e.shiftKey) return;
        if (e.key === "Enter" && input.trim() !== "") {
            e.preventDefault();
            setInput("");
            textareaRef.current!.rows = 1;
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
            <div className={`bg-chat-background max-sm:border-t-2 sm:border-x-2 border-card-border
             h-screen space-y-2 max-h-screen overflow-y-scroll [&::-webkit-scrollbar-track]:border-card-border
             [&::-webkit-scrollbar-thumb]:hover:bg-accent [&::-webkit-scrollbar-thumb]:transition-all
             flex flex-col [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-light-background
             [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-card-border [&::-webkit-scrollbar-track]:border-l-2
             ${store.isSidebarOpen && "max-md:hidden"}`}>
                {
                    messages?.map((message) => <MessageBox key={message.id} isOuter={store.username !== message.name} message={message}/>)
                }
                <div className={`sticky bottom-0 w-full left-0 h-fit flex group ${!messages && "hidden"}`}>
                    <textarea value={input}
                              placeholder={"Write a message..."}
                              rows={1}
                              ref={textareaRef}
                              maxLength={1024}
                              onKeyDown={handleKeyPress}
                              onChange={handleInputChange}
                              className={`bg-light-background resize-none w-full min-h-15 p-2 text-lg group-has-focus:border-accent
                              [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-background
                              [&::-webkit-scrollbar-thumb]:hover:bg-accent [&::-webkit-scrollbar-thumb]:transition-all
                              [&::-webkit-scrollbar-thumb]:cursor-default
                              [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-card-border
                              border-t-2 border-card-border focus:outline-none focus:border-accent transition-all h-auto`}>
                    </textarea>
                    <button spellCheck={"false"} className={`
                        place-self-center p-5 rounded-none bg-light-background border-t-2 border-card-border cursor-pointer
                        group-has-focus:border-accent transition-all h-full
                        ${!input.trim() && "text-light-background pointer-events-none focus:bg-light-background"}
                        hover:text-accent hover:bg-card-border flex justify-center focus:outline-none focus:bg-card-border`}>
                        <SendHorizonal className={"place-self-center w-8 h-8"}/>
                    </button>

                </div>

            </div>
            :
            <h1 className="place-self-center text-2xl justify-self-center">Select a chat to open it</h1>

    );
}