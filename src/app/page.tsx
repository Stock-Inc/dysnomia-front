"use client";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";
import useSessionRedirect from "@/hook/useSessionRedirect";

export default function Page() {
    useSessionRedirect("/home");
    return (
        <div className="flex flex-col items-center justify-center p-6 font-main space-y-5">
            <Image
                fetchPriority={"high"}
                priority={true}
                aria-label={"Dysnomia logo"}
                className={"drop-shadow-accent max-sm:w-1/2 mb-10 sm:mb-20"}
                src={"./icon.svg"}
                alt={"logo"}
                width={300}
                height={300} />
            <h1 className="md:text-5xl text-4xl">Dysnomia</h1>
            <p className="md:text-2xl text-xl text-center">Free open source messenger that values your
                <span className={"text-accent font-bold text-shadow-glow"}> privacy</span>.</p>
            <div className="flex justify-evenly sm:space-x-10 max-sm:flex-col max-sm:space-y-4">
                <Link className="h-fit" href={"/login"}><Button onClickAction={() => {}}>Get Started</Button></Link>
                <Button variant={"outline"} onClickAction={() => {}}>About Us</Button>
            </div>
        </div>
    );
}