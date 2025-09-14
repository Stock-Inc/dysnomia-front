"use client";
import Button from "@/components/Button";
import {User} from "lucide-react";
import {redirect} from "next/navigation";

export default function ProfileButton() {
    return (
        <Button
            onClickAction={() => redirect("/profile")}
            variant={"outline"}
            className={`z-30 absolute right-0 m-4 hover:drop-shadow-none border-foreground 
            text-foreground hover:scale-none hover:border-accent hover:text-accent`}>
            <User/>
        </Button>
    );
}