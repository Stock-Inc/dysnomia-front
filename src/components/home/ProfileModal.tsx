"use client";
import Button from "@/components/Button";
import {LogOut, Settings, User} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {persistentStore} from "@/lib/app-store";
import ProfileModalButton from "@/components/home/ProfileModalButton";
import {logoutAction} from "@/lib/auth";
import {redirect, RedirectType} from "next/navigation";

export default function ProfileModal() {
    const store = persistentStore();
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            const modalRect = modalRef.current?.getBoundingClientRect();
            if (!modalRect || !isOpen) return;
            if (e.x > modalRect.left && e.x < modalRect.right && e.y < modalRect.bottom && e.y > modalRect.top) return;
            setIsOpen(false);
        }
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [isOpen]);

    function logout() {
        logoutAction().then(() => {
            store.reset();
            redirect("/login");
        });
    }

    return (
        <div
            ref={modalRef}
            className={
                `absolute z-30 right-0 m-4 flex flex-col font-main text-xl max-md:${
                    !store.isSidebarOpen && "hidden"
                }`
        }>
            <Button
                ariaLabel={"Open profile modal"}
                onClickAction={() => setIsOpen(i => !i)}
                variant={"outline"}
                className={`border-foreground place-self-end hover:drop-shadow-none hover:bg-card-border
                text-foreground hover:scale-none hover:border-accent hover:text-accent`}>
                <User/>
            </Button>
            <div className={`${!isOpen && "hidden"} transition-all
            mt-2 bg-light-background flex flex-col border-2 border-card-border rounded-2xl p-2 space-y-2`}>
                <p>Logged in as: <span className={"text-accent text-shadow-glow"}>{store.username}</span></p>
                <ProfileModalButton href={`/profile/${store.username}`}>
                    <User className={"group-hover:drop-shadow-white-glow place-self-center"}/>
                    <p>Profile</p>
                </ProfileModalButton>
                <ProfileModalButton href={'/settings'}>
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