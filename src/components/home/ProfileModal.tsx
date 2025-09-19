"use client";
import Button from "@/components/Button";
import {LogOut, Settings, User} from "lucide-react";
import {useState} from "react";
import {appStore} from "@/lib/app-store";
import ProfileModalButton from "@/components/home/ProfileModalButton";
import {redirect} from "next/navigation";
import {logoutAction} from "@/lib/auth";

export default function ProfileModal() {
    const store = appStore();
    const [isOpen, setIsOpen] = useState(false);
    function logout() {
        logoutAction().then(() => {
            store.setDisplayName("");
            store.setUsername("");
            store.setCurrentChatId("");
            redirect("/login");
        });
    }
    return (
        <div className={"absolute z-30 right-0 m-4 flex flex-col font-main text-xl"}>
            <Button
                onClickAction={() => setIsOpen(i => !i)}
                variant={"outline"}
                className={`border-foreground place-self-end
            text-foreground hover:scale-none hover:border-accent hover:text-accent`}>
                <User/>
            </Button>
            <div className={`${!isOpen && "hidden"} transition-all
            mt-2 bg-light-background flex flex-col border-2 border-foreground rounded-2xl p-2 space-y-2`}>
                <p>Logged in as: <span className={"text-accent text-shadow-glow"}>{store.username}</span></p>
                <ProfileModalButton onClickAction={() => {redirect("/profile")}}>
                    <User className={"group-hover:drop-shadow-white-glow place-self-center"}/>
                    <p>Profile</p>
                </ProfileModalButton>
                <ProfileModalButton onClickAction={() => {redirect("/settings")}}>
                    <Settings className={"group-hover:drop-shadow-white-glow place-self-center"}/>
                    <p>Settings</p>
                </ProfileModalButton>
                <ProfileModalButton dangerous onClickAction={logout}>
                    <LogOut className={"group-hover:drop-shadow-error-glow place-self-center"}/>
                    <p>Log Out</p>
                </ProfileModalButton>
            </div>
        </div>
    );
}