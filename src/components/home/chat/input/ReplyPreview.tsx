import {X} from "lucide-react";
import React from "react";
import {ChatMessage} from "@/components/home/chat/ChatArea";

export default function ReplyPreview(
    {
        replyId,
        messageToReplyTo,
        cancelReplyAction,
    }: {
        replyId: number;
        messageToReplyTo: ChatMessage | null;
        cancelReplyAction: () => void;
    }
) {
    return (
        <div className={`${!replyId && "hidden"} line-clamp-1 border-t-2 sm:border-2 sm:border-b-0
                            border-card-border group-has-focus:border-accent bg-light-background flex justify-between transition-all`}>
            <div className={"flex space-x-2 p-2"}>
                <p className={"text-lg"}>{messageToReplyTo?.name === "" ? "anon" : messageToReplyTo?.name}:</p>
                <q className={"text-sm place-self-center line-clamp-2 wrap-anywhere"}>{messageToReplyTo?.message}</q>
            </div>
            <button aria-label={"Cancel reply"} onClick={cancelReplyAction}
                    className={`place-self-center cursor-pointer transition-all focus:outline-none hover:text-accent
                                        hover:bg-card-border focus:text-accent focus:bg-card-border h-full aspect-square`}>
                <X className={"place-self-center"}/>
            </button>
        </div>
    );
}