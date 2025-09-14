"use client";
import Button from "@/components/Button";
import {SidebarIcon} from "lucide-react";
import {useEffect, useRef, useState} from "react";

const initialWidth = 240;

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const isResizing = useRef(false);
    const [width, setWidth] = useState(initialWidth);
    const sidebarRef = useRef(null);

    //TODO: Make sidebar resizable

    // useEffect(() => {
    //     function handleMouseMove(e: MouseEvent) {
    //         if (!isResizing.current || !sidebarRef.current) return;
    //         const newWidth = e.clientX;
    //         if (newWidth >= initialWidth && newWidth < window.innerWidth * 0.9 && screen.width >= 640) {
    //             setWidth(newWidth);
    //         }
    //     }
    //     function handleMouseUp(e: MouseEvent) {
    //         isResizing.current = false;
    //     }
    //     window.addEventListener("mousemove", handleMouseMove);
    //     window.addEventListener("mouseup", handleMouseUp);
    //     return () => {
    //         window.removeEventListener("mousemove", handleMouseMove);
    //         window.removeEventListener("mouseup", handleMouseUp);
    //     };
    // }, []);

    return (
        <div>
            <Button
                variant={"outline"}
                className={`z-30 absolute m-2 hover:drop-shadow-none border-foreground 
                text-foreground hover:scale-none hover:border-accent hover:text-accent`}
                onClickAction={() => {setIsOpen(o => !o)}}
            >
                <SidebarIcon/>
            </Button>
            <div
                ref={sidebarRef}
                className={
                    `max-sm:w-full transition-transform ease-in-out duration-300 w-60
                    ${!isOpen && "-translate-x-full border-r-2 border-card-border"} 
                    h-screen max-h-screen bg-light-background absolute
                    z-10 left-0 top-0 flex flex-col font-main`
                }
            >
                <div onMouseDown={(e) => {
                        e.preventDefault();
                        isResizing.current = true;
                    }}
                     // style={{left: width}}
                     className={`${!isOpen && "hidden"} max-sm:hidden fixed cursor-ew-resize w-0.5 h-full bg-card-border left-60`}></div>
                <h2 className={"text-center text-3xl border-b-2 border-card-border p-4"}>Chats</h2>
            </div>
        </div>

    );
}