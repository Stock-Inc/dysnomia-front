"use client";
import {User} from "lucide-react";
import {useParams} from "next/navigation";
import classBuilder from "@/lib/classBuilder";
import {motion} from "motion/react";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";

export interface ProfileDetails {
    username: string;
    role: string;
}

export default function ProfileDetails() {
    const {username} = useParams<{username: string}>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {data, isLoading, error} = useQuery({
        queryKey: ["profile"],
        queryFn: () => fetch(`https://api.femboymatrix.su/user/${username}`).then(res => res.json()),
    });

    useEffect(() => {
        if (data?.error) setErrorMessage(data?.error);
        else if (error) setErrorMessage(error.message);
        else setErrorMessage(null);
    }, [data, isLoading, error]);

    return (

        <div className={"flex justify-evenly sm:space-x-10 max-sm:flex-col"}>
            <div className={"flex flex-col space-y-2"}>
                <User className={"border-2 border-foreground rounded-2xl w-40 h-40 place-self-center"}/>
                <h2
                    className={
                        classBuilder(
                            `text-2xl text-center`,
                            ["text-error", errorMessage !== null],
                            ["text-xl", isLoading || errorMessage !== null],
                        )
                    }
                >
                    {
                        isLoading ?
                            <p className={"animate-pulse"} >
                                Loading
                            </p> : !errorMessage ? data?.username :
                            <>
                                <motion.span
                                    className={"inline-block relative pr-1"}
                                    animate={{scale: [1, 2, 1], rotate: [-45, 0], x:[0, -40, 0]}}
                                    transition={{duration: 0.3, ease: "backOut"}}
                                >
                                    !
                                </motion.span>
                                <motion.span
                                    className={"inline-block relative"}
                                    animate={{scale: [1, 1.5, 1]}}
                                    transition={{duration: 0.3, ease: "backOut"}}
                                >
                                    An error occurred
                                </motion.span>
                                <motion.span
                                    className={"inline-block relative pl-1"}
                                    animate={{scale: [1, 2, 1], rotate: [45, 0], x:[0, 40, 0]}}
                                    transition={{duration: 0.3, ease: "backOut"}}
                                >
                                    !
                                </motion.span>
                            </>
                    }
                </h2>
                <button
                    onClick={e => {
                        e.preventDefault();
                        if (isLoading) return;
                        navigator.clipboard.writeText(`@${username}`);
                    }}
                    className={"w-fit h-fit place-self-center focus:outline-none"}
                >
                    <h3
                        className={
                            classBuilder(
                                `text-lg text-dark-accent text-center underline cursor-pointer`,
                                ["text-error", errorMessage !== null],
                                ["hover:text-accent", !errorMessage],
                            )
                        }
                    >
                        @{username}
                    </h3>
                </button>
            </div>
            {/*TODO: make bio editable*/}
            {/*TODO: make user tags in bio clickable*/}
            <div className={"flex flex-col max-sm:mt-4 max-sm:w-60 sm:w-80 md:w-120 lg:w-180"}>
                {
                    isLoading ? <div className={"grid grid-cols-6 space-x-4 space-y-4"}>
                        <div className={"col-span-1 h-4 animate-pulse rounded-2xl p-2 bg-gray-600"}/>
                        <div className={"col-span-2 h-4 animate-pulse rounded-2xl p-2 bg-gray-600"}/>
                        <div className={"col-span-3 h-4 animate-pulse rounded-2xl p-2 bg-gray-600"}/>
                        <div className={"col-span-2 h-4 animate-pulse rounded-2xl p-2 bg-gray-600"}/>
                        <div className={"col-span-3 h-4 animate-pulse rounded-2xl p-2 bg-gray-600"}/>
                        <div className={"col-span-1 h-4 animate-pulse rounded-2xl p-2 bg-gray-600"}/>
                        <div className={"col-span-4 h-4 animate-pulse rounded-2xl p-2 bg-gray-600"}/>
                        <div className={"col-span-1 h-4 animate-pulse rounded-2xl p-2 bg-gray-600"}/>
                    </div> : !errorMessage ?
                        <p className={"text-lg"}>Profile Bio please make it a feature @{data?.username}</p> :
                        <p className={"text-lg"}>Something went wrong...</p>
                }
            </div>
        </div>
    );
}