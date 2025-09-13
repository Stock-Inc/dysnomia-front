import Link from "next/link";
import SignupForm from "@/app/signup/SignupForm";

export default function Page() {
    return (
        <div className={"flex flex-col justify-center h-screen font-main"}>
            <div className="bg-light-background p-8 place-self-center border-2 border-card-border
             rounded-2xl flex flex-col space-y-4">
                <h1 className="text-3xl text-center">Register
                    in <span className="text-accent">Dysnomia</span></h1>
                <SignupForm/>
                <Link href={"/login"}>
                    <p className="text-lg text-dark-accent text-center underline hover:text-accent transition-all">
                        Already have an account? Log in!
                    </p>
                </Link>
            </div>
        </div>
    );
}