"use client";
import {useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {signupAction} from "@/lib/auth";
import Button from "@/components/Button";
import Link from "next/link";
import {AtSign, Shield, ShieldCheck, User} from "lucide-react";
import {redirect} from "next/navigation";
import {persistentStore} from "@/lib/app-store";
import classBuilder from "@/lib/classBuilder";

const formSchema = z.object({
    username: z.string().
    min(3, {error: "Username has to be at least 3 characters long"})
        .regex(/^[A-Za-z0-9_-]+$/, {error: "Username can only contain letters, numbers, '-' or '_'."})
        .max(20, {error: "Username can not be longer than 20 symbols"}),
    email: z.email(),
    password: z.string().min(8, {error: "Password has to be at least 8 characters long."})
        .regex(/[A-Z]/, {error: "Password must contain at least one capital letter."})
        .regex(/[0-9]/, {error: "Password must contain at least one digit."})
        .regex(/[\W_]/, {error: "Password must contain at least one special character."}),
    confirmPassword: z.string().min(8, {error: "Password has to be at least 8 characters long."}),
    agreeToTerms: z.literal(true, {error: "You must agree to the terms and conditions."}),
}).refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function SignupForm() {
    const persistStore = persistentStore();
    const [canSubmit, setCanSubmit] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        setError(null);
        setCanSubmit(false);
        const result = await signupAction(values);
        if (result.success) {
            setCanSubmit(true);
            persistStore.setDisplayName(values.username); //TODO: get display name from server
            persistStore.setUsername(values.username);
            redirect("/home");
        } else {
            console.log(result.message);
            setCanSubmit(true);
            setError(result.message);
        }
    }

    return (
        <form className="flex flex-col space-y-4 transition-all" onSubmit={form.handleSubmit(handleSubmit)}>
            <p className={`${!error && "hidden"} text-error text-xl`}>{error}</p>
            <div className={"flex flex-col space-y-2"}>
                <div className={"flex space-x-4 group"}>
                    <User className={classBuilder(
                        `scale-140 place-self-center transition-all group-focus-within:drop-shadow-accent text-accent`,
                        ["text-error", error !== null || form.formState.errors.username],
                    )}/>
                    <input
                        spellCheck={"false"}
                        onFocus={() => setError(null)}
                        placeholder={"Username"}
                        className={classBuilder(
                            `w-full border-2 rounded-2xl text-xl focus:outline-2 p-2 focus:text-accent focus:shadow-glow 
                            transition-all border-accent focus:outline-accent`,
                            ["border-error focus:outline-error text-error", error !== null || form.formState.errors.username],
                        )}
                        type={"text"} {...form.register("username")}
                    />
                </div>
                {form.formState.errors.username && <p className={"text-md text-error"}>{form.formState.errors.username.message}</p>}
            </div>
            <div className={"flex flex-col space-y-2"}>
                <div className={"flex space-x-4 group"}>
                    <AtSign className={classBuilder(
                        `scale-140 place-self-center transition-all group-focus-within:drop-shadow-accent text-accent`,
                        ["text-error", error !== null || form.formState.errors.email]
                    )}/>
                    <input
                        spellCheck={"false"}
                        onFocus={() => setError(null)}
                        placeholder={"Email"}
                        className={classBuilder(
                            `w-full border-2 rounded-2xl text-xl focus:outline-2 p-2 focus:text-accent 
                            focus:shadow-glow transition-all border-accent focus:outline-accent`,
                            ["border-error focus:outline-error text-error", error !== null || form.formState.errors.email]
                        )}
                        type={"text"}
                        {...form.register("email")}
                    />
                </div>
                {form.formState.errors.email && <p className={"text-md text-error"}>{form.formState.errors.email.message}</p>}
            </div>

            {/*TODO: add "show password" button*/}
            <div className={"flex flex-col space-y-2"}>
                <div className={"flex space-x-4 group"}>
                    <Shield className={classBuilder(
                        `scale-140 place-self-center transition-all group-focus-within:drop-shadow-accent text-accent`,
                        ["text-error", error !== null || form.formState.errors.password])
                    }/>
                    <input
                        spellCheck={"false"}
                        onFocus={() => setError(null)}
                        placeholder={"Create Password"}
                        className={classBuilder(
                            `w-full border-2 rounded-2xl text-xl focus:outline-2 p-2 focus:text-accent focus:shadow-glow 
                            transition-all border-accent focus:outline-accent`,
                            ["border-error focus:outline-error text-error", error !== null || form.formState.errors.password])}
                        type={"password"} {...form.register("password")}
                    />
                </div>
                {form.formState.errors.password && <p className={"text-md text-error"}>{form.formState.errors.password.message}</p>}
            </div>
            <div className={"flex flex-col space-y-2"}>
                <div className={"flex space-x-4 group"}>
                    <ShieldCheck className={classBuilder(
                        `scale-140 place-self-center transition-all group-focus-within:drop-shadow-accent text-accent`,
                        ["text-error", error !== null || form.formState.errors.password]
                    )}/>
                    <input
                        spellCheck={"false"}
                        onFocus={() => setError(null)}
                        placeholder={"Confirm Password"}
                        className={classBuilder(
                            `w-full border-2 rounded-2xl text-xl focus:outline-2 p-2 focus:text-accent focus:shadow-glow 
                            transition-all text-accent focus:outline-accent border-accent`,
                            ["border-error text-error focus:outline-error", error !== null || form.formState.errors.password]
                        )}
                        type={"password"} {...form.register("confirmPassword")}
                    />
                </div>
                {form.formState.errors.confirmPassword && <p className={"text-md text-error"}>{form.formState.errors.confirmPassword.message}</p>}
            </div>

            <div className={"flex flex-col space-y-2"}>
                <div className={"flex space-x-4 justify-evenly"}>
                    <label htmlFor={"terms"} className={classBuilder(
                        `text-xl`,
                        ["text-error", form.formState.errors.agreeToTerms]
                    )}>
                        Agree to the <Link className={"underline hover:text-accent transition-all"} href={"/tos"}>Terms of
                        Service</Link>
                    </label>
                    <input
                        className={classBuilder(
                            `m-0 w-6 h-6 appearance-none bg-foreground p-0 place-self-center rounded-sm border-2 border-accent
                            checked:bg-dark-accent checked:after:content-['✔'] checked:after:text-xl checked:after:text-white
                            checked:after:font-bold text-center checked:after:flex checked:after:flex-col checked:after:justify-center after:max-h-6
                            focus:outline-2 focus:outline-accent transition-all`,
                            ["border-error focus:outline-error", form.formState.errors.agreeToTerms])}
                        id={"terms"}
                        type={"checkbox"}
                        {...form.register("agreeToTerms")}
                    />
                </div>
                {form.formState.errors.agreeToTerms && <p className={"text-md text-error"}>{form.formState.errors.agreeToTerms.message}</p>}
            </div>

            <Button disabled={!canSubmit}
                    type={"submit"}
                    className={classBuilder(
                        `text-xl`,
                            ["animate-pulse", !canSubmit]
                    )}
            >
                Register
            </Button>
        </form>
    );
}