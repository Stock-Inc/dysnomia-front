"use client";
import {useRouter} from "next/navigation";

export default function GoBack() {
    const router = useRouter();
    return (
        <button
            onClick={() => router.back()}
            className={
                `border-2 border-card-border bg-light-background rounded-2xl p-2 cursor-pointer transition-all
                text-xl hover:bg-card-border hover:text-shadow-white-glow hover:text-white`
            }
        >
            Go Back
        </button>
    );
}