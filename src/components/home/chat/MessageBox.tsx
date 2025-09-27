import {ChatMessage} from "@/components/home/chat/ChatArea";
import {motion} from "motion/react";
import classBuilder from "@/lib/classBuilder";
import {redirect, RedirectType} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import React from "react";

export default function MessageBox(
    {message, isOuter, doubleClickHandler, ref, scrollToOriginal}:
    {
        message: ChatMessage,
        isOuter: boolean,
        doubleClickHandler:() => void,
        scrollToOriginal:() => void,
        ref?: React.Ref<HTMLDivElement>}
) {
    const {isLoading, error, data} = useQuery({
        queryKey: [message.id],
        queryFn: () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/${message.reply_id}`).then(res => {
            if (res.ok) return res.json();
        }),
    });

    const replyPreview = () => {
        const profileName = isLoading ? "" : data?.name || "anon";
        const text = isLoading ? "Fetching..." : (data?.error || error?.message || data?.message);
        return (
            <>
                <p className={"text-sm"}>{profileName}</p>
                <p>{text}</p>
            </>
        );
    };

    return (
        <motion.div
            ref={ref}
            onDoubleClick={doubleClickHandler}
            className={
                classBuilder(
            `text-lg rounded-2xl p-1 flex flex-col max-w-200 w-fit`,
                    ["place-self-start rounded-bl-none bg-card-border", isOuter],
                    ["place-self-end rounded-br-none text-white bg-accent", !isOuter],
                )
            }
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
        >
            <p
                className={`${message.name && "cursor-pointer hover:text-shadow-white-glow"} text-md p-1 mb-1 transition-all`}
                onClick={() => {
                    if (message.name) redirect(`/profile/${message.name}`, RedirectType.push);
                }}
            >
                {message.name || "anon"}
            </p>
            {message.reply_id !== 0 &&
                <div
                    onClick={() => {
                        if (!data?.error && !error && !isLoading) scrollToOriginal();
                    }}
                    className={
                    classBuilder(
                        `p-1 mx-1 line-clamp-2 overflow-hidden text-md cursor-pointer`,
                        [`bg-chat-outer-reply-background border-l-4 border-foreground 
                        rounded-r-xl hover:bg-chat-outer-reply-background-focus`, isOuter],
                        ["bg-dark-accent border-r-4 border-white rounded-l-xl hover:bg-dark-accent-focus", !isOuter]
                    )
                }>
                    {replyPreview()}
                </div>
            }
            <div className={"flex justify-between"}>
                <p className={"p-1 wrap-anywhere"}>{message.message}</p>
                <p className={
                    classBuilder(
                        `text-sm place-self-end p-1 select-none pointer-events-none`,
                        ["text-muted-foreground", isOuter],
                        ["text-gray-100", isOuter]
                    )
                }>
                    {
                        new Date(message.date).toLocaleTimeString("en-US", {
                            hour12: false ,
                            localeMatcher: "best fit",
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, //TODO: fix time
                        })
                    }
                </p>
            </div>
        </motion.div>
    );
}