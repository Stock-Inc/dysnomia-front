"use client";
import Button from "@/components/Button";
import {SidebarIcon} from "lucide-react";
import {useRef} from "react";
import {persistentStore} from "@/lib/app-store";
import SidebarChatButton from "@/components/home/SidebarChatButton";
import classBuilder from "@/lib/classBuilder";
import {useQuery} from "@tanstack/react-query";

interface Chat {
    id: string
    userId: number
    userName: string
}

export default function Sidebar() {
    const store = persistentStore();
    const sidebarRef = useRef<null | HTMLDivElement>(null);
    const {data, error, isLoading} = useQuery<Chat[] | undefined>({
        queryKey: ["chats"],
        queryFn: () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats`).then(res => {
            console.log(res);
            return [
                {
                    id: "1",
                    userId: 30174932,
                    userName: "Go"
                },
                {
                    id: "2",
                    userId: 30174933,
                    userName: "Golden Freddy"
                }
            ] as Chat[];
            if (res.ok) return [
                {
                    id: "1",
                    userId: 30174932,
                    userName: "Go"
                },
                {
                    id: "2",
                    userId: 30174933,
                    userName: "Golden Freddy"
                }
            ] as Chat[];
            else throw new Error(res.statusText);
        }) //TODO: update when actual backend is ready
    });
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
                <h2 className={`${!store.isSidebarOpen && "opacity-0 pointer-events-none"} transition-all 
                text-center text-3xl border-b-2 border-card-border p-6`}>
                    Chats
                </h2>
                <div className={`${!store.isSidebarOpen && "opacity-0 pointer-events-none"} transition-all flex flex-col`}>
                    <SidebarChatButton chatId={"public"}/>
                    {
                        isLoading ? <p className={"text-center text-muted-foreground p-4"}>Fetching...</p>
                            : error ?
                                <p className={"text-center text-error p-4"}>
                                    {error.message.length === 0 ? "Something went wrong..." : error.message}
                                </p>
                            : data!.map(
                                (c) =>
                                    <SidebarChatButton
                                        key={c.id}
                                        chatId={c.id}
                                        userId={c.userId}
                                        userName={c.userName}
                                    />
                            )
                    }
                </div>

            </div>
        </div>
    );
}