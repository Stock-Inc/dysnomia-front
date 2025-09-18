import {appStore} from "@/lib/app-store";
import SockJS from "sockjs-client";
import {useEffect, useRef, useState} from "react";
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

        return () => {
            stompClient.current?.deactivate();
        };

    }, []);

    return (
        store.currentChatId ?
            <div className={`bg-chat-background max-sm:border-t-2 sm:border-x-2 border-card-border
             h-screen space-y-2 max-h-screen overflow-y-scroll [&::-webkit-scrollbar-track]:border-card-border
             flex flex-col [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-light-background
             [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-card-border [&::-webkit-scrollbar-track]:border-l-2
             ${store.isSidebarOpen && "max-md:hidden"}`}>
                {
                    messages?.map((message) => <MessageBox key={message.id} isOuter={store.username !== message.name} message={message}/>)
                }
                <div className={`sticky bottom-0 w-full left-0 h-fit flex group ${!messages && "hidden"}`}>
                    {/*TODO: resizing*/}
                    <textarea value={input} placeholder={"Write a message..."}
                              onChange={(e) => setInput(e.currentTarget.value)}
                              className={`bg-light-background resize-none w-full min-h-15 p-2 text-lg group-has-focus:border-accent
                              border-t-2 border-card-border focus:outline-none focus:border-accent transition-all h-auto`}>
                    </textarea>
                    <button spellCheck={"false"} className={`
                        place-self-center p-5 rounded-none bg-light-background border-t-2 border-card-border cursor-pointer
                        group-has-focus:border-accent transition-all
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