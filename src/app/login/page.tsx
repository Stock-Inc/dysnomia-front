"use client";
import Link from "next/link";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import Button from "@/components/Button";
import {useForm} from "react-hook-form";
import {User} from "lucide-react/";
import {Lock} from "lucide-react";

const formSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export default function Page() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        fetch("https://api.femboymatrix.su/auth/sign-in", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(values),
        }).then(res => console.log(res)).catch(err => console.log(err));
    }

    return (
        <div className={"flex flex-col justify-center h-screen font-main"}>
            <div className="bg-light-background p-8 place-self-center border-2 border-card-border
             rounded-2xl flex flex-col space-y-4">
                <h1 className="text-3xl">Log in to <span className="text-accent">Dysnomia</span></h1>
                <form className="flex flex-col space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex space-x-4">
                        <User className="scale-140 place-self-center text-accent"/>
                        <input
                            className="border-2 rounded-2xl border-accent text-xl
                        focus:outline-accent focus:outline-2 p-2 text-accent focus:shadow-glow"
                            placeholder="Username"
                            {...form.register("username")}
                        />
                    </div>
                    <div className="flex space-x-4">
                        <Lock className="scale-140 place-self-center text-accent"/>
                        <input className="border-2 rounded-2xl border-accent text-xl
                           focus:outline-accent focus:outline-2 p-2 text-accent focus:shadow-glow"
                               placeholder="Password"
                               {...form.register("password")}/>
                    </div>
                    <Button className={"text-xl "} type="submit">Login</Button>
                </form>
                <p className="text-lg text-dark-accent underline hover:text-accent transition-all">Forgot password?</p>
                <Link href={"/signup"}>
                    <p className="text-lg text-dark-accent underline hover:text-accent transition-all">
                        Don&apos;t have an account? Create it!
                    </p>
                </Link>
            </div>
        </div>
    );
}