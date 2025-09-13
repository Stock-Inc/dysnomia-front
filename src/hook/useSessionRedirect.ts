import {useEffect} from "react";
import {checkForActiveSessions} from "@/lib/auth";
import {appStore} from "@/lib/app-store";
import {redirect} from "next/navigation";

//TODO: WIP - cannot test rn because backend shits itself
export default function useSessionRedirect(url: string) {
    useEffect(() => {
        const checkSession = async () => {
            try {
                const activeSessionData = await checkForActiveSessions();
                const appState = appStore.getState();

                if (activeSessionData.success) {
                    appState.setUsername(activeSessionData.username!);
                    appState.setAccessToken(activeSessionData.accessToken!);
                    console.log(activeSessionData.accessToken);
                    redirect(url);
                } else {
                    console.log(activeSessionData.message);
                }
            } catch (error) {
                console.error('Session check failed:', error);
            }
        };
        checkSession();
    }, [url]);
}