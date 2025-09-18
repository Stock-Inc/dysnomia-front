import {ChatMessage} from "@/components/home/ChatArea";
import {useEffect, useState} from "react";

export default function MessageBox({message, isOuter}: {message: ChatMessage, isOuter: boolean}) {

    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        if (message.reply_id === 0) return;
        fetch(`https://api.femboymatrix.su/message/${message.reply_id}`, {method: "GET"})
            .then(r => r.json()).catch(e => console.log(e))
            .then(msg => setReplyText(msg.message)).catch(e => console.log(e));
    }, [message.reply_id]);

    return (
        <div className={`text-lg rounded-2xl p-1 flex flex-col max-w-300 w-fit ml-4 ${isOuter ? 
            "place-self-start rounded-bl-none bg-card-border" :
            "place-self-end rounded-br-none text-white bg-accent"}`}
        >
            <p className={"text-md p-1 mb-1"}>
                {message.name ? message.name : "anon"}
            </p>
            {message.reply_id !== 0 &&
                <div className={`p-1 mx-1 line-clamp-2 overflow-hidden text-md ${isOuter ?
                    "bg-chat-outer-reply-background border-l-4 border-foreground rounded-r-xl" : 
                    "bg-dark-accent border-r-4 border-white rounded-l-xl"}`}>
                    {replyText}
                </div>
            }
            <div className={"flex justify-between"}>
                <p className={"p-1 wrap-anywhere"}>{message.message}</p>
                <p className={`text-sm place-self-end p-1 ${isOuter ? "text-muted-foreground" : "text-gray-100"}`}>
                    {new Date(message.date).toLocaleTimeString("en-US", {
                        hour12: false ,
                        localeMatcher: "best fit",
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    })}
                </p>
            </div>
        </div>
    );
}