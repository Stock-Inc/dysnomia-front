"use client";

import {persistentStore} from "@/lib/app-store";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Page() {

    const store = persistentStore();
    const router = useRouter();

    useEffect(() => {
        router.push(`/profile/${store.username}`);
    }, []);

    return (
        <></>
    );
}