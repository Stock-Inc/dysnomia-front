import {Client, frameCallbackType} from "@stomp/stompjs";
import {useEffect, useRef, useState} from "react";
import SockJS from "sockjs-client";

interface useStompClientOptions {
    reconnectDelay: number;
    debugHandler?: (info: string) => void;
    onConnect?: frameCallbackType;
    onError?: frameCallbackType;
    onPublish?: () => void;
}

export default function useStompClient<T, U>(url: string, options: useStompClientOptions): [T[] | null, (body: U) => void] {
    //TODO: caching
    const stompClient = useRef<Client | null>(null);
    const [messages, setMessages] = useState<T[] | null>(null);
    const publish = (body: U) => {
        stompClient.current?.publish({
            destination: "/app/chat",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });
    };
    useEffect(() => {
        stompClient.current = new Client({
            webSocketFactory: () => new SockJS(url),
            reconnectDelay: options.reconnectDelay,
            debug: options.debugHandler,
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
                stompClient.current!.publish({destination: "/app/history", body: JSON.stringify([]), headers: {'content-type': 'application/json'}});
            },
            onStompError: (frame) => {
                options.onError?.(frame);
            },
        });
        stompClient.current.activate();
        return () => {
            stompClient.current?.deactivate();
        };
    }, []);
    return [messages, publish];
}