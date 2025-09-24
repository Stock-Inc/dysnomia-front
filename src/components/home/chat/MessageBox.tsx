import {ChatMessage} from "@/components/home/chat/ChatArea";
import {motion} from "motion/react";
import useReplyMessage from "@/hook/useReplyMessage";
import classBuilder from "@/lib/classBuilder";

export default function MessageBox(
    {message, isOuter, doubleClickHandler}:
    {message: ChatMessage, isOuter: boolean, doubleClickHandler:() => void}
) {
    const replyMessage = useReplyMessage(message.reply_id);

    const replyPreview = () => {
        const loading = replyMessage.loading;
        const profileName = loading ? "..." : replyMessage.data?.name;
        const text = loading ? "..." : (replyMessage.error || replyMessage.data?.message);
        return (
            <>
                <p className={"text-sm"}>{profileName}</p>
                <p>{text}</p>
            </>
        );
    };

    //TODO: clicking on a reply text scrolls to the original message

    return (
        <motion.div
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
            <p className={"text-md p-1 mb-1 text-shadow-white-glow"}>
                {message.name || "anon"}
            </p>
            {message.reply_id !== 0 &&
                <div onClick={() => {
                    if (!replyMessage.error && !replyMessage.loading) {
                        //Scroll stuff
                    }
                }} className={
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