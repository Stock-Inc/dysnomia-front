"use client";
//TODO: merge with ProfileDetails
import {persistentStore} from "@/lib/app-store";
import {Camera, Pen, User} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import useCookie from "@/hook/useCookie";
import {ProfileDetails} from "@/components/profile/ProfileDetails";
import {useEffect, useRef, useState} from "react";
import classBuilder from "@/lib/classBuilder";

export default function LocalProfileDetails() {
    const store = persistentStore();
    const token = useCookie("dysnomia-access");
    const {data, isLoading, error} = useQuery({
        queryKey: ["local profile", store.username, token],
        queryFn: () => fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/${store.username}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        ).then(res => res.json() as unknown as ProfileDetails),
        enabled: !!token && !!store.username
    });
    const [pendingName, setPendingName] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const nameInputRef = useRef<null | HTMLInputElement>(null);
    const [pendingDescription, setPendingDescription] = useState("");
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const descriptionInputRef = useRef<null | HTMLTextAreaElement>(null);

    useEffect(() => {
        nameInputRef.current?.focus();
    }, [isEditingName]);
    useEffect(() => {
        descriptionInputRef.current?.focus();
    }, [isEditingDescription]);

    return (
        <div className={"flex justify-evenly sm:space-x-10 max-sm:flex-col max-h-[80vh]"}>
            <div className={"flex flex-col space-y-2"}>
                <button
                    className={`w-fit h-fit flex justify-center group rounded-2xl 
                    border-2 border-foreground cursor-pointer focus:outline-none place-self-center`}
                >
                    <User className={"group-has-hover:blur-xs w-40 h-40 place-self-center transition-all"}/>
                    <Camera className={`absolute w-20 h-20 place-self-center p-2 rounded-full 
                    not-group-has-hover:opacity-0 transition-all group-has-hover:bg-card-border`}/>
                </button>
                <button
                    className={"justify-center focus:outline-none cursor-text text-2xl text-center group"}
                    onClick={() => setIsEditingName(true)}
                >
                    {
                        isEditingName ?
                            <input
                                onChange={(e) => {
                                    setPendingName(e.currentTarget.value);
                                }}
                                //TODO: zod validation
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" && pendingName.trim() !== store.displayName
                                        && pendingName.trim().length >= 3 && pendingName.trim().length <= 16
                                    ) {
                                        store.setDisplayName(pendingName);
                                        setPendingName("");
                                        setIsEditingName(false);
                                        //TODO: api call
                                    } else if (e.key === "Escape") {
                                        setPendingName("");
                                        setIsEditingName(false);
                                    }
                                }}
                                autoComplete={"off"}
                                id={"displayName"}
                                onBlur={() => setIsEditingName(false)}
                                ref={nameInputRef}
                                className={
                                    `text-center focus:outline-none border-accent transition-all border-b-2 not-focus:border-b-light-background w-40`
                                }
                                defaultValue={pendingName || store.displayName || data?.displayName}
                            /> :
                            <h2 className={"border-b-2 border-light-background group-has-hover:border-foreground transition-all"}>
                                {store.displayName || data?.displayName}
                            </h2>
                    }
                </button>
                <button
                    className={"w-fit h-fit place-self-center focus:outline-none"}
                    onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(`@${store.username}`);
                    }}
                >
                    <h3 className={"text-lg text-dark-accent text-center underline cursor-pointer hover:text-accent"}>
                        @{store.username}
                    </h3>
                </button>
            </div>
            <div className={"flex flex-col h-full max-sm:mt-4 max-sm:w-60 sm:w-80 md:w-120 lg:w-180 group"}>
                <div className={`${!(isLoading || !!error) && "flex space-x-2"}`}>
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
                        </div> : !error ?
                            (isEditingDescription ? <textarea
                                ref={descriptionInputRef}
                                id={"bio"}
                                onChange={(e) => {
                                    setPendingDescription(e.currentTarget.value);
                                }}
                                onBlur={() => {
                                    setIsEditingDescription(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        if (e.shiftKey) return;
                                        store.setProfileDescription(pendingDescription.trim());
                                        setPendingDescription("");
                                        setIsEditingDescription(false);
                                        //TODO: api call
                                    }
                                }}
                                rows={8}
                                placeholder={"Your profile bio..."}
                                defaultValue={(pendingDescription || store.profileDescription || data?.bio)}
                                className={
                                    `text-lg resize-none focus:outline-none w-full h-full transition-all whitespace-pre
                                    [&::-webkit-scrollbar-track]:border-card-border
                                    [&::-webkit-scrollbar-thumb]:hover:bg-accent [&::-webkit-scrollbar-thumb]:transition-all
                                    [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:rounded-full 
                                    [&::-webkit-scrollbar-track]:bg-background [&::-webkit-scrollbar-thumb]:rounded-full 
                                    [&::-webkit-scrollbar-thumb]:bg-card-border`
                                }
                            /> : <p
                                onClick={() => setIsEditingDescription(true)}
                                className={
                                    `text-lg w-full h-full transition-all whitespace-pre wrap-anywhere 
                                    overflow-y-scroll max-sm:max-h-[22.5vh] sm:max-h-[23vh]
                                    [&::-webkit-scrollbar-track]:border-card-border
                                    [&::-webkit-scrollbar-thumb]:hover:bg-accent [&::-webkit-scrollbar-thumb]:transition-all
                                    [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:rounded-full 
                                    [&::-webkit-scrollbar-track]:bg-background [&::-webkit-scrollbar-thumb]:rounded-full 
                                    [&::-webkit-scrollbar-thumb]:bg-card-border`
                                }
                            >
                                {(store.profileDescription || data?.bio) ?? "Nothing here"}
                            </p>) :
                            <p className={"text-lg"}>Something went wrong...</p>
                    }
                </div>
            </div>
        </div>
    );
}