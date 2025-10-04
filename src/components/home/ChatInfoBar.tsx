import {useQuery} from "@tanstack/react-query";
import Image from "next/image";
import {Suspense} from "react";
//TODO: merge profile modal, sidebar toggle and this
export default function ChatInfoBar(
    {
        chatId
    }: {
        chatId: string;
    })
{
    const {data, error, isLoading} = useQuery({
        queryKey: [chatId],
        queryFn: () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}`).then(response => response.json())
    });
    return (
        <div className={
            `bg-background sm:border-2 border-t-none border-card-border space-x-5 max-sm:pl-21
            p-2 sm:pl-4 flex max-sm:justify-center max-sm:absolute max-sm:w-full max-sm:top-0`
        }>
            {
                isLoading ? <div className="w-12 h-12 rounded-full place-self-center bg-gray-500 animate-pulse"/> :
                    <Image
                        unoptimized
                        width={48}
                        height={48}
                        className={"place-self-center rounded-full"}
                        src={"https://placehold.co/400"}
                        alt={"pfp"}
                    />
            }
            <div className={"flex flex-col space-y-2"}>
                <h1 className={"text-shadow-white-glow text-xl"}>
                    {
                        isLoading ? "Loading..." : error ? "Error..." : "Chat Name"
                    }
                </h1>
                {
                    isLoading ? <div className="p-2 w-30 bg-gray-500 animate-pulse rounded-2xl"/>
                        : error ? <p className={"text-error text-lg"}>Couldn&apos;t fetch</p>
                            : <p className={"text-lg"}>last seen never</p>
                }
            </div>
        </div>
    );
}