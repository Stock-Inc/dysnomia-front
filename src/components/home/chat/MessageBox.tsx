import {ChatMessage} from "@/components/home/chat/ChatArea";
import {motion} from "motion/react";
import classBuilder from "@/lib/classBuilder";
import {redirect, RedirectType} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import React from "react";

export default function MessageBox(
    {message, isOuter, doubleClickHandler, ref, scrollToOriginal, contextHandler}:
    {
        message: ChatMessage,
        isOuter: boolean,
        doubleClickHandler:() => void,
        scrollToOriginal:() => void,
        contextHandler:(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
        ref: React.Ref<HTMLDivElement>
    }
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
                <p className={`${isLoading && "p-[10px]"}`}>{text}</p>
            </>
        );
    };

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
            className={`msgbg${message.id} px-2`}
        >
            <div
                onContextMenu={(e) => {
                    e.preventDefault();
                    contextHandler(e);
                }}
                ref={ref}
                onDoubleClick={doubleClickHandler}
                className={
                    classBuilder(
                        `text-lg rounded-2xl p-1 flex flex-col max-w-200 w-fit`,
                        [isOuter, "place-self-start rounded-bl-none bg-card-border"],
                        [!isOuter, "place-self-end rounded-br-none text-white bg-accent"],
                    )
                }
            >
                <p
                    className={`${message.name && "cursor-pointer hover:text-shadow-white-glow"} text-md p-1 mb-1 transition-all w-fit`}
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
                                [isOuter, `bg-chat-outer-reply-background border-l-4 border-foreground 
                                    rounded-r-xl hover:bg-chat-outer-reply-background-focus`],
                                [!isOuter, "bg-dark-accent border-r-4 border-white rounded-l-xl hover:bg-dark-accent-focus"]
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
                            [isOuter, "text-muted-foreground"],
                            [isOuter, "text-gray-100"]
                        )
                    }>
                        {
                            new Date(message.date * 1000).toLocaleTimeString("en-US", {
                                hour12: false ,
                                localeMatcher: "best fit",
                                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                            })
                        }
                    </p>
                </div>
            </div>
        </motion.div>
    );
}