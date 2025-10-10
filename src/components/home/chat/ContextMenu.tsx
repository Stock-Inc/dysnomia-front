import React, {Ref} from "react";
import ContextMenuButton from "@/components/home/chat/ContextMenuButton";
import {Clipboard, Forward, Pin, Reply, Trash} from "lucide-react";

export default function ContextMenu(
    {
        ref,
        state,
        replyAction,
        forwardAction,
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
        forwardAction: () => void;
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
            role={"menu"}
            className={
                `${!state?.open && "opacity-0 pointer-events-none"} fixed transition-opacity 
                bg-light-background rounded-2xl flex flex-col text-xl`
            }
        >
            <ContextMenuButton onClick={replyAction} position={"top"}>
                <Reply className={"group-hover:drop-shadow-white-glow"}/>
                <p>Reply</p>
            </ContextMenuButton>
            <ContextMenuButton onClick={forwardAction}>
                <Forward className={"group-hover:drop-shadow-white-glow"}/>
                <p>Forward</p>
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