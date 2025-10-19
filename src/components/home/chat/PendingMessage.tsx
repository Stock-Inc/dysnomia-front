import {ChatPublishBody} from "@/components/home/chat/ChatArea";
import {redirect, RedirectType} from "next/navigation";
import React from "react";

export default function PendingMessage(
    {
        message
    }: {
        message: ChatPublishBody
    }) {
    return (
        <div
            className={`text-lg rounded-2xl p-1 flex flex-col max-w-200 w-fit place-self-end rounded-br-none text-background bg-accent animate-pulse`}
        >
            <p
                className={"cursor-pointer hover:font-bold text-md p-1 mb-1 transition-all w-fit"}
                onClick={() => {
                    if (message.name) redirect(`/profile/${message.name}`, RedirectType.push);
                }}
            >
                {message.name}
            </p>
            <div>

            </div>
            <div className={"flex justify-between"}>
                <p className={"p-1 wrap-anywhere"}>{message.message}</p>
                <p className={`text-sm place-self-end p-1 select-none pointer-events-none text-light-background`}>
                    {
                        new Date(Date.now()).toLocaleTimeString("en-US", {
                            hour12: false ,
                            localeMatcher: "best fit",
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        })
                    }
                </p>
            </div>
        </div>
    );
}