import {create} from "zustand/react";
import {persist} from "zustand/middleware";

export type PersistentStoreState = {
    username: string,
    setUsername: (username: string) => void,
    displayName: string,
    setDisplayName: (displayName: string) => void,
    isSidebarOpen: boolean,
    setIsSidebarOpen: () => void,
    currentChatId: string,
    setCurrentChatId: (id: string) => void,
}

export const persistentStore = create(persist<PersistentStoreState>(
    (set, get) => ({
        username: "",
        setUsername: username => set({username: username}),
        displayName: "",
        setDisplayName: displayName => set({displayName: displayName}),
        isSidebarOpen: true,
        setIsSidebarOpen: () => set({isSidebarOpen: !get().isSidebarOpen}),
        currentChatId: "",
        setCurrentChatId: id => set({currentChatId: id}),
    }), {
        name: "dysnomia-client-store"
    })
);

// type TemporaryStoreState = {
// }
//
// export const temporaryStore =
//     create<TemporaryStoreState>((set) => ({
//
//     }
// ));