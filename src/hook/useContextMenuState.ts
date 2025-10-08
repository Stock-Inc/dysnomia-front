import React, {RefObject, useEffect, useState} from "react";
import {ChatMessage} from "@/components/home/chat/ChatArea";

interface ContextMenuState {
    x: number,
    y: number,
    open: boolean,
    currentMessage: {
        element: HTMLDivElement;
        message: ChatMessage;
    },
}

export default function useContextMenuState(contextMenuRef: RefObject<HTMLDivElement | null>):
    [
        ContextMenuState | null,
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>,
         message: ChatMessage,
         messageRefs: RefObject<Map<number, HTMLDivElement>>,
         chatAreaRef: RefObject<HTMLDivElement | null>) => void
    ]
{
    const [contextMenuState, setContextMenuState] = useState<ContextMenuState | null>(null);

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
    }, [contextMenuState, contextMenuRef]);

    function contextHandler(
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        message: ChatMessage,
        messageRefs: RefObject<Map<number, HTMLDivElement>>,
        chatAreaRef: RefObject<HTMLDivElement | null>
    ) {
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
    }

    return [contextMenuState, contextHandler];
}