"use client";
import Button from "@/components/Button";
import {User} from "lucide-react";
import {redirect} from "next/navigation";

export default function ProfileButton() {
    //TODO: make it open a little window where you can see some general info and be able to log out or visit profile page
    return (
        <Button
            onClickAction={() => redirect("/profile")}
            variant={"outline"}
            className={`z-30 absolute right-0 m-4 border-foreground 
            text-foreground hover:scale-none hover:border-accent hover:text-accent`}>
            <User/>
        </Button>
    );
}