import {create} from "zustand/react";

type AppStoreState = {
    username: string,
    setUsername: (username: string) => void,
    accessToken: string,
    setAccessToken: (accessToken: string) => void,
}

export const appStore = create<AppStoreState>((set) => ({
    username: '',
    setUsername: (username: string) => set({username: username}),
    accessToken: '',
    setAccessToken: (accessToken: string) => set({accessToken: accessToken}),
    })
);