"use client";
import {Lock, User} from "lucide-react";
import Button from "@/components/Button";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginAction, LoginData} from "@/lib/auth";
import {redirect} from "next/navigation";
import {useRef, useState} from "react";
import {persistentStore} from "@/lib/app-store";
import classBuilder from "@/lib/classBuilder";

const formSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export default function LoginForm() {
    const persistStore = persistentStore();
    const [canSubmit, setCanSubmit] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const consecutiveErrors = useRef(0);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    async function handleSubmit(values: LoginData) {
        setError(null);
        setCanSubmit(false);
        const result = await loginAction(values);
        if (result.success) {
            setCanSubmit(true);
            persistStore.setDisplayName(values.username); //TODO: get display name from server
            persistStore.setUsername(values.username);
            redirect("/home");
        } else {
            consecutiveErrors.current++;
            let delay = 0;
            if (consecutiveErrors.current > 3) {
                delay = 1000;
            }
            setTimeout(() => {
                setCanSubmit(true);
                console.log(result.message);
                setError(result.message);
            }, delay);
        }
    }

    return (
        <form className="flex flex-col space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <p className={`${!error && "hidden"} text-error text-xl`}>{error}</p>
            <div className="flex space-x-4 group">
                <User className={
                    classBuilder(
                        `scale-140 place-self-center transition-all group-focus-within:drop-shadow-accent text-accent`,
                        [error !== null, "text-error"]
                    )
                }/>
                <input
                    spellCheck={"false"}
                    onFocus={() => setError(null)}
                    className={
                        classBuilder(
                            `w-full border-2 rounded-2xl text-xl focus:outline-2 p-2 focus:text-accent 
                            focus:shadow-glow transition-all border-accent focus:outline-accent`,
                            [error !== null, "border-error focus:outline-error text-error"]
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
                        [error !== null, "text-error"]
                    )
                }/>
                <input
                    spellCheck={"false"}
                    onFocus={() => setError(null)}
                    className={
                        classBuilder(
                            `w-full border-2 rounded-2xl text-xl focus:outline-2 p-2 focus:text-accent 
                            focus:shadow-glow transition-all border-accent focus:outline-accent`,
                            [error !== null, "border-error focus:outline-error text-error"]
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