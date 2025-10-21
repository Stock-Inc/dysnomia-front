"use client";
import {User} from "lucide-react";
import {useParams} from "next/navigation";
import classBuilder from "@/lib/classBuilder";
import {motion} from "motion/react";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import useCookie from "@/hook/useCookie";
import P from "@/components/P";

export interface ProfileDetails {
    username: string;
    displayName: string;
    role: string;
    bio: string;
}

export default function ProfileDetails() {
    const {username} = useParams<{username: string}>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const tokenFromCookie = useCookie("dysnomia-access");
    const {data, isLoading, error} = useQuery({
        queryKey: ["profile", tokenFromCookie],
        queryFn: () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenFromCookie}`,
            }
        }).then(res => res.json() as unknown as ProfileDetails),
        enabled: !!tokenFromCookie,
    });

    useEffect(() => {
        if (error) setErrorMessage(error.message);
        else setErrorMessage(null);
    }, [isLoading, error]);

    return (

        <div className={"flex justify-evenly sm:space-x-10 max-sm:flex-col"}>
            <div className={"flex flex-col space-y-2"}>
                <User className={"border-2 border-foreground rounded-2xl w-40 h-40 place-self-center"}/>
                <h2
                    className={
                        classBuilder(
                            `text-2xl text-center`,
                            [errorMessage !== null, "text-error"],
                            [isLoading || errorMessage !== null, "text-xl"],
                        )
                    }
                >
                    {
                        isLoading ?
                            <p className={"animate-pulse"} >
                                Loading
                            </p> : !errorMessage ? data?.displayName ?? data?.username :
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
                                [errorMessage !== null, "text-error"],
                                [!errorMessage, "hover:text-accent"],
                            )
                        }
                    >
                        @{username}
                    </h3>
                </button>
            </div>
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
                        <P linkVariant={"bio"} className={"text-lg"}>{data?.bio ?? "Nothing here"}</P> :
                        <p className={"text-lg"}>Something went wrong...</p>
                }
            </div>
        </div>
    );
}