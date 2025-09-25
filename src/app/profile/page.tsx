"use client";
import {redirect, usePathname} from "next/navigation";
import {persistentStore} from "@/lib/app-store";
import {useEffect} from "react";

export default function Page() {
    //TODO: make this redirect serverside
    const pathname = usePathname();
    const store = persistentStore();

    useEffect(() => {
        if (pathname === "/profile") redirect(`/profile/${store.username}`);
    }, [store, pathname]);

    return (<></>);
}