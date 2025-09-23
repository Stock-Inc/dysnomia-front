import {ChatMessage} from "@/components/home/chat/ChatArea";
import {useEffect, useState} from "react";

interface UseReplyMessageResult {
    data: ChatMessage | null;
    loading: boolean;
    error: string | null;
}

export default function useReplyMessage(replyId: number | undefined): UseReplyMessageResult {
    const [data, setData] = useState<ChatMessage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        setData(null);
        setError(null);
        if (!replyId || replyId === 0) {
            setLoading(false);
            return;
        }
        fetch(`https://api.femboymatrix.su/message/${replyId}`, {method: "GET"})
            .then(async (response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                try {
                    const message: ChatMessage = await response.json();
                    setData(message);
                } catch (e) {
                    setError((e as Error).message);
                }
            })
            .catch((error: Error) => {
                console.error(error);
                setError(error.message);
            })
            .finally(() => setLoading(false));
    }, [replyId]);

    return {data, loading, error};
}