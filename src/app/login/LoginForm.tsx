"use client";
import {Lock, User} from "lucide-react";
import Button from "@/components/Button";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginAction, LoginData} from "@/lib/auth";
import {redirect} from "next/navigation";
import {useState} from "react";
import {persistentStore} from "@/lib/app-store";
import classBuilder from "@/lib/classBuilder";

const formSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export default function LoginForm() {
    const persistStore = persistentStore();
    const [canSubmit, setCanSubmit] = useState(true);
    const [errored, setErrored] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    async function handleSubmit(values: LoginData) {
        setErrored(false);
        setCanSubmit(false);
        const result = await loginAction(values);
        if (result.success) {
            setCanSubmit(true);
            persistStore.setDisplayName(values.username); //TODO: get display name from server
            persistStore.setUsername(values.username);
            redirect("/home");
        } else {
            console.log(result.message);
            setCanSubmit(true);
            setErrored(true);
        }
    }

    return (
        <form className="flex flex-col space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex space-x-4 group">
                <User className={
                    classBuilder(
                        `scale-140 place-self-center transition-all group-focus-within:drop-shadow-accent text-accent`,
                        ["text-error", errored]
                    )
                }/>
                <input
                    spellCheck={"false"}
                    onFocus={() => setErrored(false)}
                    className={
                        classBuilder(
                            `w-full border-2 rounded-2xl text-xl focus:outline-2 p-2 focus:text-accent 
                            focus:shadow-glow transition-all border-accent focus:outline-accent`,
                            ["border-error focus:outline-error text-error", errored]
                        )
                    }
                    placeholder="Username"
                    {...form.register("username")}
                />
            </div>
            <div className="flex space-x-4 group">
                <Lock className={
                    classBuilder(
                        `scale-140 place-self-center transition-all group-focus-within:drop-shadow-accent text-accent`,
                        ["text-error", errored]
                    )
                }/>
                <input
                    spellCheck={"false"}
                    onFocus={() => setErrored(false)}
                    className={
                        classBuilder(
                            `w-full border-2 rounded-2xl text-xl focus:outline-2 p-2 focus:text-accent 
                            focus:shadow-glow transition-all border-accent focus:outline-accent`,
                            ["border-error focus:outline-error text-error", errored]
                        )
                    }
                    placeholder="Password"
                    type="password"
                    {...form.register("password")}/>
            </div>
            <Button disabled={!canSubmit} className={`${!canSubmit && "animate-pulse"} text-xl`} type="submit">Login</Button>
        </form>
    );
}