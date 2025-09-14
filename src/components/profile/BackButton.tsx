"use client";
import Button from "@/components/Button";
import {ArrowBigLeft} from "lucide-react";
import {redirect} from "next/navigation";

export default function BackButton() {
    return (
        <Button variant={"outline"}
                className={`z-30 absolute right-0 m-4 hover:drop-shadow-none border-foreground 
                text-foreground hover:scale-none hover:border-accent hover:text-accent`}
                onClickAction={() => redirect("/home")}>
            <ArrowBigLeft/>
        </Button>
    );
}