import Link from "next/link";
import LoginForm from "@/app/login/LoginForm";

export default function Page() {

    return (
        <div className={"flex flex-col justify-center h-screen font-main"}>
            <div className="bg-light-background p-8 place-self-center border-2 border-card-border
             rounded-2xl flex flex-col space-y-4">
                <h1 className="text-3xl">Log in to <span className="text-accent">Dysnomia</span></h1>
                {/*TODO: make some kind of pop up that displays error messages*/}
                <LoginForm />
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