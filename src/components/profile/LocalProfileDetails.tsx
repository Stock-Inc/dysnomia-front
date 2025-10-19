"use client";
//TODO: merge with ProfileDetails
import {persistentStore} from "@/lib/app-store";
import {Camera, Pen, User} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import useCookie from "@/hook/useCookie";
import {ProfileDetails} from "@/components/profile/ProfileDetails";
import {useState} from "react";

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
    const [newName, setNewName] = useState("");
    const [newBio, setNewBio] = useState("");

    return (
        //TODO: zod + react hook form
        <div className={"flex justify-evenly items-start flex-col max-h-[80vh] p-4 text-xl"}>
            <form className={"space-y-4 flex flex-col w-full"}>
                <button
                    onClick={(e) => e.preventDefault()}
                    className={`w-fit h-fit flex justify-center group rounded-2xl place-self-center 
                    border-2 border-foreground cursor-pointer focus:outline-none`}
                >
                    <User className={"w-40 h-40 place-self-center brightness-50"}/>
                    <Camera className={`absolute w-20 h-20 place-self-center p-2 rounded-full transition-all group-has-hover:text-accent`}/>
                </button>
                <div className={"w-full"}>
                    <label htmlFor={"displayName"} className={"text-lg text-muted-foreground"}>Display Name</label>
                    <input
                        //TODO: zod validation
                        onChange={(e) => setNewName(e.currentTarget.value)}
                        autoComplete={"off"}
                        id={"displayName"}
                        maxLength={64}
                        className={
                            `focus:outline-none border-foreground transition-all border-2 focus:border-accent w-full rounded-2xl p-1`
                        }
                        defaultValue={store.displayName || data?.displayName}
                    />
                </div>
                <div className={"w-full"}>
                    <div className={`${!(isLoading || !!error) && "flex flex-col space-x-2"}`}>
                        <label className={"text-lg text-muted-foreground"} htmlFor={"bio"}>Bio</label>
                        <input
                            onChange={(e) => setNewBio(e.currentTarget.value)}
                            id={"bio"}
                            autoComplete={"off"}
                            maxLength={512}
                            placeholder={"Nothing here..."}
                            defaultValue={(store.profileDescription || data?.bio)}
                            className={
                                `focus:outline-none border-foreground transition-all border-2 focus:border-accent w-full rounded-2xl p-1`
                            }
                        />
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        if (newName.trim().length >= 3) {
                            store.setDisplayName(newName.trim());
                        }
                        store.setProfileDescription(newBio.trim());
                    }}
                    className={`hover:bg-card-border border-2 hover:text-accent border-card-border 
                    rounded-2xl mt-5 p-2 transition-all cursor-pointer focus:outline-none`}
                    type={"submit"}
                >
                    Submit
                </button>
            </form>
        </div>
    );
}