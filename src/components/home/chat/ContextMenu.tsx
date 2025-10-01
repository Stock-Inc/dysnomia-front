import React, {Ref} from "react";
import ContextMenuButton from "@/components/home/chat/ContextMenuButton";
import {Clipboard, Pin, Reply, Trash} from "lucide-react";

export default function ContextMenu(
    {
        ref,
        state,
        replyAction,
        copyAction,
        pinAction,
        deleteAction,
    }: {
        ref: Ref<HTMLDivElement>;
        state: {
            x: number;
            y: number;
            open: boolean;
        } | null;
        replyAction: () => void;
        copyAction: () => void;
        pinAction: () => void;
        deleteAction: () => void;
    })
{
    return (
        <div
            ref={ref}
            onContextMenu={(e) => e.preventDefault()}
            style={{left: state?.x, top: state?.y}}
            className={
                `${!state?.open && "opacity-0 pointer-events-none"} fixed transition-opacity 
                bg-light-background rounded-2xl flex flex-col text-xl`
            }
        >
            <ContextMenuButton onClick={replyAction} position={"top"}>
                <Reply className={"group-hover:drop-shadow-white-glow"}/>
                <p>Reply</p>
            </ContextMenuButton>
            <ContextMenuButton onClick={copyAction}>
                <Clipboard className={"group-hover:drop-shadow-white-glow"}/>
                <p>Copy Text</p>
            </ContextMenuButton>
            <ContextMenuButton onClick={pinAction}>
                <Pin className={"group-hover:drop-shadow-white-glow"}/>
                <p>Pin</p>
            </ContextMenuButton>
            <ContextMenuButton onClick={deleteAction} dangerous position={"bottom"}>
                <Trash className={"group-hover:drop-shadow-error-glow"}/>
                <p>Delete</p>
            </ContextMenuButton>
        </div>
    );
}