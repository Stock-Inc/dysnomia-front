import {create} from "zustand/react";
import {persist} from "zustand/middleware";

type AppStoreState = {
    username: string,
    setUsername: (username: string) => void,
    displayName: string,
    setDisplayName: (displayName: string) => void,
    isSidebarOpen: boolean,
    setIsSidebarOpen: () => void,
}

export const appStore = create(persist<AppStoreState>(
    (set, get) => ({
        username: '',
        setUsername: username => set({username: username}),
        displayName: '',
        setDisplayName: displayName => set({displayName: displayName}),
        isSidebarOpen: true,
        setIsSidebarOpen: () => set({isSidebarOpen: !get().isSidebarOpen})
    }), {
        name: "dysnomia-client-store"
    })
);