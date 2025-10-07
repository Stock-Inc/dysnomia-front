import {useEffect, useState} from "react";

export default function useCookie(cookieName: string): string | undefined {
    const [cookie, setCookie] = useState<string | undefined>(undefined);
    useEffect(() => {
        setCookie(document.cookie
            .split("; ")
            .find(c => c.startsWith(`${cookieName}=`))
            ?.split("=")[1]);
    }, [setCookie, cookieName]);
    return cookie;
}