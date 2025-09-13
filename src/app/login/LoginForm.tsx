"use client";
import {Lock, User} from "lucide-react";
import Button from "@/components/Button";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginAction, LoginData} from "@/lib/auth";
import {redirect} from "next/navigation";
import {useState} from "react";
import {appStore} from "@/lib/app-store";

const formSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export default function LoginForm() {
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
            appStore.getState().setUsername(values.username);
            appStore.getState().setAccessToken(result.accessToken!);
            redirect("/");
        } else {
            console.log(result.message);
            setCanSubmit(true);
            setErrored(true);
        }
    }

    return (
        <form className="flex flex-col space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex space-x-4 group">
                <User className={`scale-140 place-self-center transition-all group-focus-within:drop-shadow-accent
                 ${errored ? "text-error" : "text-accent"}`}/>
                <input
                    onFocus={() => setErrored(false)}
                    className={`border-2 rounded-2xl text-xl focus:outline-2 p-2 text-accent focus:shadow-glow transition-all w-full
                    ${errored ? "border-error focus:outline-error" : "border-accent focus:outline-accent"}`}
                    placeholder="Username"
                    {...form.register("username")}
                />
            </div>
            <div className="flex space-x-4 group">
                <Lock className={`scale-140 place-self-center transition-all group-focus-within:drop-shadow-accent
                 ${errored ? "text-error" : "text-accent"}`}/>
                <input
                    onFocus={() => setErrored(false)}
                    className={`border-2 rounded-2xl text-xl focus:outline-2 p-2 text-accent focus:shadow-glow transition-all w-full
                    ${errored ? "border-error focus:outline-error" : "border-accent focus:outline-accent"}`}
                    placeholder="Password"
                    type="password"
                    {...form.register("password")}/>
            </div>
            <Button disabled={!canSubmit} className={`text-xl ${!canSubmit && "animate-pulse"}`} type="submit">Login</Button>
        </form>
    );
}