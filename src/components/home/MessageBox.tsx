import {ChatMessage} from "@/components/home/ChatArea";

export default function MessageBox({message, isOuter}: {message: ChatMessage, isOuter: boolean}) {
    //TODO: wait for backend to actually finish this one
    return (
        <div className={`text-lg rounded-2xl p-1 flex flex-col max-w-100 w-fit ${isOuter ? 
            "place-self-start rounded-bl-none bg-card-border" :
            "place-self-end rounded-br-none text-white bg-accent"}`}
        >
            <p className={"text-xl p-1"}>{message.name ? message.name : "anon"}</p>
            {/*message.replyId &&*/ <div className={`p-1 mx-1 line-clamp-2 overflow-hidden text-md ${isOuter ?
                "bg-chat-outer-reply-background border-l-4 border-foreground" : 
                "bg-dark-accent border-r-4 border-white"}`}>
                Message placeholder giga long to test some shit Message placeholder giga long to test some shit
            </div>}
            <div className={"flex justify-between"}>
                <p className={"p-1"}>{message.message}</p>
                <p className={`text-sm place-self-end ${isOuter ? "text-muted-foreground" : "text-gray-100"}`}>
                    {new Date(message.date).toUTCString()}
                </p>

            </div>
        </div>
    );
}