"use client";
import React, {ChangeEvent, useRef, useState} from "react";
import {SendHorizonal} from "lucide-react";
import classBuilder from "@/lib/classBuilder";
import {ChatMessage, ChatPublishBody} from "@/components/home/chat/ChatArea";
import ReplyPreview from "@/components/home/chat/input/ReplyPreview";

export default function ChatInput(
    {
        publishMessageAction,
        username,
        replyId,
        onSendMessageAction,
        messageToReplyTo,
        messages,
        cancelReplyAction,
    }: {
        publishMessageAction: (body: ChatPublishBody) => void;
        username: string;
        replyId: number;
        onSendMessageAction: () => void;
        messageToReplyTo: ChatMessage | null;
        messages: ChatMessage[] | null;
        cancelReplyAction: () => void;
    })
{
    const [input, setInput] = useState("");
    const [isCommand, setIsCommand] = useState(false);
    const textareaRef = useRef<null | HTMLTextAreaElement>(null);

    function handleInputChange (e: ChangeEvent<HTMLTextAreaElement>) {
        const textarea = textareaRef.current!;
        const value = e.currentTarget.value;
        setInput(value);
        if (value.trim()[0] === "/") {
            setIsCommand(true);
        } else {
            setIsCommand(false);
        }

        textarea.style.height = 'auto';

        const minHeight = 24;
        const maxHeight = 120;
        const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);

        textarea.style.height = `${newHeight}px`;
    }

    function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && e.shiftKey) return;
        if (e.key === "Enter" && input.trim() !== "") {
            e.preventDefault();
            sendMessage();
        }
    }

    function sendMessage() {
        publishMessageAction(
            {
                name: username,
                message: input,
                reply_id: replyId,
            }
        );
        setInput("");
        onSendMessageAction();
    }

    return (
        <div className={`${messages === null && "hidden"} sticky bottom-0 w-full left-0 h-fit flex flex-col group`}>
            {
                replyId ? <ReplyPreview replyId={replyId} messageToReplyTo={messageToReplyTo} cancelReplyAction={cancelReplyAction} />
                    : isCommand && <div>Command Preview</div>
            }
            <div className={"flex"}>
                <textarea
                    value={input}
                    placeholder={"Write a message..."}
                    ref={textareaRef}
                    maxLength={1024}
                    onKeyDown={handleKeyPress}
                    onChange={handleInputChange}
                    className={`bg-light-background resize-none w-full min-h-15 p-2 text-lg group-has-focus:border-accent
                    [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-background
                    [&::-webkit-scrollbar-thumb]:hover:bg-accent [&::-webkit-scrollbar-thumb]:transition-all
                    [&::-webkit-scrollbar-thumb]:cursor-default
                    [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-card-border
                    border-t-2 sm:border-l-2 border-card-border focus:outline-none focus:border-accent transition-all h-auto`}>
                </textarea>
                <button
                    aria-label={"Send button"}
                    spellCheck={"false"}
                    onClick={sendMessage}
                    className={classBuilder(
                        `place-self-center p-5 rounded-none bg-light-background border-t-2 sm:border-r-2 border-card-border
                         cursor-pointer group-has-focus:border-accent transition-all h-full hover:text-accent 
                         hover:bg-card-border focus:bg-card-border flex justify-center focus:outline-none`,
                        ["text-light-background pointer-events-none focus:bg-light-background", !input.trim()]
                    )
                }>
                    <SendHorizonal className={"place-self-center w-8 h-8"}/>
                </button>
            </div>
        </div>
    );
}