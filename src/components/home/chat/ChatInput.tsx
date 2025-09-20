"use client";
import React, {ChangeEventHandler, KeyboardEventHandler, MouseEventHandler} from "react";
import {SendHorizonal} from "lucide-react";

export default function ChatInput(
    {
        taValue,
        taRef,
        taKeyDownAction,
        taChangeAction,
        sendButtonAction,
    }: {
        taValue: string,
        taRef: React.Ref<HTMLTextAreaElement>,
        taKeyDownAction: KeyboardEventHandler<HTMLTextAreaElement>,
        taChangeAction: ChangeEventHandler<HTMLTextAreaElement>,
        sendButtonAction: MouseEventHandler<HTMLButtonElement>,
    })
{
    return (
        <div className={"flex"}>
            <textarea value={taValue}
                placeholder={"Write a message..."}
                rows={1}
                ref={taRef}
                maxLength={1024}
                onKeyDown={taKeyDownAction}
                onChange={taChangeAction}
                className={`bg-light-background resize-none w-full min-h-15 p-2 text-lg group-has-focus:border-accent
                [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-background
                [&::-webkit-scrollbar-thumb]:hover:bg-accent [&::-webkit-scrollbar-thumb]:transition-all
                [&::-webkit-scrollbar-thumb]:cursor-default
                [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-card-border
                border-t-2 border-card-border focus:outline-none focus:border-accent transition-all h-auto`}>
            </textarea>
            <button aria-label={"Send button"} spellCheck={"false"} onClick={sendButtonAction} className={`
                        place-self-center p-5 rounded-none bg-light-background border-t-2 border-card-border cursor-pointer
                        group-has-focus:border-accent transition-all h-full
                        ${!taValue.trim() && "text-light-background pointer-events-none focus:bg-light-background"}
                        hover:text-accent hover:bg-card-border focus:bg-card-border flex justify-center focus:outline-none`}>
                <SendHorizonal className={"place-self-center w-8 h-8"}/>
            </button>
        </div>
    );
}