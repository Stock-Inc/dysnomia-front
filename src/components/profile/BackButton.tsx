"use client";
import Button from "@/components/Button";
import {ArrowBigLeft} from "lucide-react";
import {useRouter} from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    return (
        <Button variant={"outline"}
                ariaLabel={"Go back"}
                className={`z-30 absolute right-0 m-4 border-foreground hover:drop-shadow-none hover:bg-card-border
                text-foreground hover:scale-none hover:border-accent hover:text-accent`}
                onClickAction={() => router.back()}>
            <ArrowBigLeft/>
        </Button>
    );
}