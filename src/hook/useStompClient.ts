import {Client, frameCallbackType} from "@stomp/stompjs";
import {useEffect, useRef, useState} from "react";
import SockJS from "sockjs-client";
import useCookie from "@/hook/useCookie";

interface useStompClientOptions {
    reconnectDelay: number;
    debugHandler?: (info: string) => void;
    onConnect?: frameCallbackType;
    onError?: frameCallbackType;
    onDisconnect?: frameCallbackType;
    onPublish?: () => void;
}

export default function useStompClient<T, U>(url: string, options: useStompClientOptions): [T[] | null, (body: U) => void, (message: T) => void] {
    //TODO: caching
    const stompClient = useRef<Client | null>(null);
    const [messages, setMessages] = useState<T[] | null>(null);
    const tokenFromCookie = useCookie("dysnomia-access");
    function pushMessage(msg: T): void {
        setMessages((prevMessages) => [...(prevMessages ?? []), msg]);
    }
    const publish = (body: U) => {
        stompClient.current?.publish({
            destination: "/app/chat",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
    };
    useEffect(() => {
        if (!tokenFromCookie) {
            //TODO: iunno kick the user out
        }
        else {
            stompClient.current = new Client({
                webSocketFactory: () => new SockJS(url),
                reconnectDelay: options.reconnectDelay,
                debug: options.debugHandler,
                connectHeaders: {
                    "passcode": tokenFromCookie,
                },
                onConnect: (frame) => {
                    options.onConnect?.(frame);
                    stompClient.current!.subscribe("/topic/message",
                        (message) => {
                            const parsedMessage: T = JSON.parse(message.body);
                            setMessages(m => [...(m ?? []), parsedMessage]);
                        });
                    stompClient.current!.subscribe("/topic/history",
                        (message) => {
                            const parsedMessages: T[] = JSON.parse(message.body);
                            setMessages(parsedMessages.reverse());
                        });
                    stompClient.current!.publish({
                        destination: "/app/history",
                        body: JSON.stringify([]),
                        headers: {
                            "content-type": "application/json",
                        }
                    });
                },
                onStompError: (frame) => {
                    options.onError?.(frame);
                },
                onDisconnect: (frame) => {
                    options.onDisconnect?.(frame);
                },
            });
            stompClient.current.activate();
            return () => {
                stompClient.current?.deactivate();
            };
        }
    }, []);
    return [messages, publish, pushMessage];
}