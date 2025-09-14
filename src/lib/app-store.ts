import {create} from "zustand/react";
import {persist} from "zustand/middleware";

type AppStoreState = {
    username: string,
    setUsername: (username: string) => void,
    displayName: string,
    setDisplayName: (displayName: string) => void,
}

export const appStore = create(persist<AppStoreState>(
    (set) => ({
        username: '',
        setUsername: username => set({username: username}),
        displayName: '',
        setDisplayName: displayName => set({displayName: displayName}),
    }), {
        name: "dysnomia-client-store"
    })
);