"use client";
import Button from "@/components/Button";
import {SidebarIcon} from "lucide-react";
import {useRef} from "react";
import {persistentStore} from "@/lib/app-store";
import SidebarChatButton from "@/components/home/SidebarChatButton";
import classBuilder from "@/lib/classBuilder";

export default function Sidebar() {
    const store = persistentStore();
    const sidebarRef = useRef<null | HTMLDivElement>(null);
    // const [width, setWidth] = useState(360);
    // const [height, setHeight] = useState(0);

    //TODO: disable the awkward slide that the sidebar does if it is initially closed

    // useEffect(() => {
    //     setHeight(window.innerHeight);
    // }, []);
    //
    // useEffect(() => {
    //     function handleResize() {
    //         if (window.innerWidth < 800) {
    //             setWidth(window.innerWidth);
    //         }
    //         else if (width > window.innerWidth * 0.5) {
    //             setWidth(window.innerWidth * 0.5);
    //         }
    //         setHeight(window.innerHeight);
    //     }
    //     window.addEventListener("resize", handleResize);
    //     return () => window.removeEventListener("resize", handleResize);
    // }, [width]);

    return (
        <div>
            <Button
                ariaLabel={"Toggle Sidebar"}
                variant={"outline"}
                className={`z-30 absolute m-4 border-foreground hover:drop-shadow-none hover:bg-card-border
                text-foreground hover:scale-none hover:border-accent hover:text-accent`}
                onClickAction={() => {
                    store.setIsSidebarOpen();
                }}
            >
                <SidebarIcon/>
            </Button>
            <div
                ref={sidebarRef}
                // style={{width, height}}
                className={classBuilder(
                    `max-md:w-full max-md:absolute transition-all border-r-1 border-card-border
                    h-screen max-h-screen bg-light-background z-10 top-0 flex flex-col font-main`,
                    [!store.isSidebarOpen, "md:w-0 max-md:-translate-x-full"],
                    [store.isSidebarOpen, "md:w-90"],
                )}
            >
                <div
                    // draggable={true}
                    // onDrag={(e) => {
                    //     let newWidth = e.clientX;
                    //     if (newWidth < 360) newWidth = 360;
                    //     if (newWidth > window.innerWidth * 0.5) newWidth = window.innerWidth * 0.5;
                    //     setWidth(newWidth);
                    // }}
                    // style={{left: width}}
                    className={classBuilder(
                        // "cursor-ew-resize",
                        `max-sm:hidden fixed w-4 h-full bg-card-border left-90 opacity-0`,
                        [!store.isSidebarOpen, "sm:hidden"]
                    )}
                />
                <h2 className={"text-center text-3xl border-b-2 border-card-border p-6"}>Chats</h2>
                <div className={"flex flex-col space-y-2"}>
                    <SidebarChatButton chatId={"public"}/>
                </div>

            </div>
        </div>

    );
}