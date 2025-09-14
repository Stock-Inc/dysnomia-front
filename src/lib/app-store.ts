import {create} from "zustand/react";
import {persist} from "zustand/middleware";

type AppStoreState = {
    username: string,
    setUsername: (username: string) => void,
}

export const appStore = create(persist<AppStoreState>(
    (set) => ({
        username: '',
        setUsername: (username: string) => set({username: username}),
    }), {
        name: "dysnomia-client-store"
    })
);