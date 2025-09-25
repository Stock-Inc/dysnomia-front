"use client";
import {User} from "lucide-react";
import {useParams} from "next/navigation";
import useProfileDetails from "@/hook/useProfileDetails";
import classBuilder from "@/lib/classBuilder";
import SplitText from "@/components/SplitText";
import {motion, stagger, useAnimate} from "motion/react";
import {useEffect} from "react";

export interface ProfileDetails {
    username: string;
    role: string;
}

export default function ProfileDetails() {
    const {username} = useParams<{username: string}>();
    const [scope, animate] = useAnimate();

    const {data, isLoading, error} = useProfileDetails<ProfileDetails>(username);

    useEffect(() => {
        const nameSymbols = document.querySelectorAll(".nameSymbol");
        const tagSymbols = document.querySelectorAll(".tagSymbol");
        animate(nameSymbols, {opacity: [1, 0, 1]}, {delay: stagger(0.1), repeat: Infinity, repeatDelay: 1});
        animate(tagSymbols, {opacity: [1, 0, 1]}, {delay: stagger(0.1), repeat: Infinity, repeatDelay: 1});
    }, [animate]);

    return (
        <div className={"flex justify-evenly sm:space-x-10 max-sm:flex-col"}>
            <div className={"flex flex-col space-y-2"}>
                <User className={"border-2 border-foreground rounded-2xl w-40 h-40 place-self-center"}/>
                <h2
                    className={
                        classBuilder(
                            `text-2xl text-center`,
                            ["text-error", error !== null],
                            ["text-xl", isLoading || error !== null],
                        )
                    }
                >
                    {
                        isLoading ?
                            <SplitText ref={scope} initial={{}} childrenClassName={"nameSymbol"} split={"symbol"}>
                                Loading
                            </SplitText> : !error ? data?.username :
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
                        if (isLoading || error) return;
                        navigator.clipboard.writeText(`@${data?.username}`);
                    }}
                    className={"w-fit h-fit place-self-center focus:outline-none"}
                >
                    <h3
                        className={
                            classBuilder(
                                `text-lg text-dark-accent text-center underline`,
                                ["text-error", error !== null],
                                ["hover:text-accent cursor-pointer", !error],
                            )
                        }
                    >
                        @{isLoading ?
                        <SplitText ref={scope} initial={{}} childrenClassName={"tagSymbol"} split={"symbol"}>Loading...</SplitText>
                        : !error ? data?.username : "oops"}
                    </h3>
                </button>
            </div>
            {/*TODO: make bio editable*/}
            {/*TODO: make user tags in bio clickable*/}
            <div className={"flex flex-col max-sm:w-60 sm:w-80 md:w-120 lg:w-180"}>
                <p className={"text-lg"}>Profile Bio please make it a feature @oneseil</p>
            </div>
        </div>
    );
}