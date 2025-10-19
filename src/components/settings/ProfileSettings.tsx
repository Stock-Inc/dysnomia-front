"use client";
import {persistentStore} from "@/lib/app-store";
import {Camera, User} from "lucide-react";
import {useMutation, useQuery} from "@tanstack/react-query";
import useCookie from "@/hook/useCookie";
import {ProfileDetails} from "@/components/profile/ProfileDetails";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const formSchema = z.object({
    displayName: z.string()
        .min(3, {message: "Display name has to be at least 3 characters long!"})
        .max(20, {error: "Display name can not be longer than 20 symbols"}),
    profileDescription: z.string()
});

export default function ProfileSettings() {
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
    const {mutate} = useMutation({
        mutationFn: (body: z.infer<typeof formSchema>) => fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/profile/edit_info`,
            {
                method: "PATCH",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        )
    });

    const form = useForm({
        resolver: zodResolver(formSchema)
    });

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        form.clearErrors();
        mutate(values, {
            onSuccess: (_) => {
                store.setDisplayName(values.displayName);
                store.setProfileDescription(values.profileDescription);
            },
            onError: (err) => console.log(err),
        });
    }

    return (
        <div className={"flex justify-evenly items-start flex-col max-h-[80vh] p-4 text-xl"}>
            <form className={"space-y-4 flex flex-col w-full"} onSubmit={form.handleSubmit(handleSubmit)}>
                <button
                    onClick={(e) => e.preventDefault()}
                    className={`w-fit h-fit flex justify-center group rounded-2xl place-self-center 
                    border-2 border-foreground cursor-pointer focus:outline-none`}
                >
                    <User className={"w-40 h-40 place-self-center brightness-50"}/>
                    <Camera className={`absolute w-20 h-20 place-self-center p-2 rounded-full transition-all group-has-hover:text-accent`}/>
                </button>
                <div className={"w-full"}>
                    <label
                        htmlFor={"displayName"}
                        className={`${!!form.formState.errors.displayName ? "text-error" : "text-muted-foreground"} text-lg transition-all`}>
                        Display Name
                    </label>
                    <input
                        {...form.register("displayName")}
                        autoComplete={"off"}
                        id={"displayName"}
                        maxLength={64}
                        className={
                            `${!!form.formState.errors.displayName ? "border-error" : "border-foreground"}
                            focus:outline-none transition-all border-2 focus:border-accent w-full rounded-2xl p-1`
                        }
                        defaultValue={store.displayName || data?.displayName}
                    />
                </div>
                <div className={"w-full"}>
                    <div className={`${!(isLoading || !!error) && "flex flex-col space-x-2"}`}>
                        <label className={"text-lg text-muted-foreground"} htmlFor={"bio"}>Bio</label>
                        <input
                            {...form.register("profileDescription")}
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
                <p className={"text-error text-lg"}>{form.formState.errors.displayName?.message}</p>
                <button
                    className={`enabled:hover:bg-card-border border-2 enabled:hover:text-accent border-card-border 
                    rounded-2xl p-2 transition-all enabled:cursor-pointer enabled:focus:outline-none disabled:text-muted-foreground`}
                    type={"submit"}
                >
                    Apply
                </button>
            </form>
        </div>
    );
}