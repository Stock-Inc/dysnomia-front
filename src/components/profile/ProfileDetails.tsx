"use client";
import {User} from "lucide-react";
import {useParams} from "next/navigation";
import useProfileDetails from "@/hook/useProfileDetails";

export interface ProfileDetails {
    username: string;
    role: string;
}

export default function ProfileDetails() {
    const {username} = useParams<{username: string}>();

    const {data, isLoading, error} = useProfileDetails<ProfileDetails>(username);

    return (
        <div className={"flex justify-evenly sm:space-x-10 max-sm:flex-col"}>
            <div className={"flex flex-col space-y-2"}>
                <User className={"border-2 border-foreground rounded-2xl w-40 h-40 place-self-center"}/>
                <h2 className={"text-2xl text-center"}>{data?.username || error}</h2>
                <button
                    onClick={e => {
                        e.preventDefault();
                        navigator.clipboard.writeText(`@${data?.username}`);
                    }}
                    className={"w-fit h-fit place-self-center"}
                >
                    <h3 className={"text-lg text-dark-accent text-center underline hover:text-accent cursor-pointer"}>
                        @{data?.username}
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