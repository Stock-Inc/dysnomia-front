"use client";
import Button from "@/components/Button";
import {SidebarIcon} from "lucide-react";
import {useRef} from "react";
import {appStore} from "@/lib/app-store";
import SidebarChatButton from "@/components/home/SidebarChatButton";

export default function Sidebar() {
    const store = appStore();
    const isResizing = useRef(false);
    const sidebarRef = useRef<null | HTMLDivElement>(null);

    //TODO: disable the awkward slide that the sidebar does if it is initially closed
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
                className={`z-30 absolute m-4 border-foreground 
                text-foreground hover:scale-none hover:border-accent hover:text-accent`}
                onClickAction={() => {
                    store.setIsSidebarOpen();
                }}
            >
                <SidebarIcon/>
            </Button>
            <div
                ref={sidebarRef}
                className={
                    `max-sm:w-full transition-transform w-90 left-0 border-r-1 border-card-border duration-75
                    ${store.isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                    h-screen max-h-screen bg-light-background absolute
                    z-10 top-0 flex flex-col font-main`
                }
            >
                <div onMouseDown={(e) => {
                        e.preventDefault();
                        isResizing.current = true;
                    }}
                     // style={{left: width}}
                     className={`${!store.isSidebarOpen && "hidden"} max-sm:hidden fixed cursor-ew-resize w-0.5 h-full bg-card-border left-90`}></div>
                <h2 className={"text-center text-3xl border-b-2 border-card-border p-6"}>Chats</h2>
                <div className={"flex flex-col space-y-2 p-2"}>
                    <SidebarChatButton chatId={"public"}/>
                </div>

            </div>
        </div>

    );
}