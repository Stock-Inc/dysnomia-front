import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {ChatMessage, ConsoleMessage} from "@/components/home/chat/ChatArea";

export type PersistentStoreState = {
    reset: () => void;
    username: string,
    setUsername: (username: string) => void,
    displayName: string,
    setDisplayName: (displayName: string) => void,
    profileDescription: string | null,
    setProfileDescription: (newBio: string | null) => void,
    isSidebarOpen: boolean,
    setIsSidebarOpen: () => void,
    currentChatId: string,
    setCurrentChatId: (id: string) => void,
    cachedMessages: Record<string, (ChatMessage | ConsoleMessage)[]>,
    setCachedMessages: (chatId: string, messages: (ChatMessage | ConsoleMessage)[]) => void,
}

export const persistentStore = create(persist<PersistentStoreState>(
    (set, get) => ({
        username: "",
        setUsername: username => set({username: username}),
        displayName: "",
        setDisplayName: displayName => set({displayName: displayName}),
        profileDescription: null,
        setProfileDescription: (newBio) => set({profileDescription: newBio}),
        isSidebarOpen: true,
        setIsSidebarOpen: () => set({isSidebarOpen: !get().isSidebarOpen}),
        currentChatId: "",
        setCurrentChatId: id => set({currentChatId: id}),
        cachedMessages: {},
        setCachedMessages: (chatId, messages) =>
            set((state) => ({
                    cachedMessages: {
                        ...state.cachedMessages,
                        [chatId]: messages,
                    }
            })),
        reset: () => set({
            username: "",
            displayName: "",
            isSidebarOpen: true,
            currentChatId: "",
            cachedMessages: {},
        })
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