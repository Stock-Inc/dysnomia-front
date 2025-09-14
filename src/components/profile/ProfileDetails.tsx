"use client";
import {appStore} from "@/lib/app-store";
import {User} from "lucide-react";

export default function ProfileDetails() {
    const store = appStore();

    return (
        <div className={"flex justify-evenly sm:space-x-10 max-sm:flex-col"}>
            <div className={"flex flex-col space-y-2"}>
                <User className={"border-2 border-foreground rounded-2xl w-40 h-40 place-self-center"}/>
                <h2 className={"text-2xl text-center"}>{store.username}</h2>
                <button
                    onClick={e => {
                        e.preventDefault();
                        navigator.clipboard.writeText(`@${store.username}`);
                    }}
                    className={"w-fit h-fit place-self-center"}
                >
                    <h3 className={"text-lg text-dark-accent text-center underline hover:text-accent cursor-pointer"}>
                        @{store.username}
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