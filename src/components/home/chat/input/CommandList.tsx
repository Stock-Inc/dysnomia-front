import {ConsoleCommand} from "@/components/home/chat/ChatArea";
import React, {useMemo} from "react";
import classBuilder from "@/lib/classBuilder";

export default function CommandList(
    {
        commands,
        isCommand,
    }: {
        commands: ConsoleCommand[] | null;
        isCommand: boolean;
    }
) {
    const list = useMemo(() => {
        if (commands === null) return <p>Loading...</p>;

        if (commands.length === 0) return <p className={"text-error"}>Something went wrong...</p>;

        return commands.map((command, index) =>
            //TODO: set input on click
            <button
                key={command.command + "|" + command.description}
                className={classBuilder(
                    `text-lg text-start flex space-x-3 p-2 focus:outline-none
                    bg-light-background cursor-pointer focus:bg-card-border hover:bg-card-border transition-all`,
                    [index === 0, "rounded-t-lg"],
                    [index === commands.length - 1, "rounded-b-lg"]
                )}
            >
                <p>{command.command}</p>
                <span className={"text-sm place-self-center text-muted-foreground"}>{command.description}</span>
            </button>
        );
    }, [commands]);
    return (
        <div className={
                `${!isCommand && "opacity-0 pointer-events-none"} absolute bottom-20 place-self-center flex flex-col mx-5
                border-2 border-card-border group-focus-within:border-accent transition-all rounded-lg bg-light-background
                overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full 
                [&::-webkit-scrollbar-thumb]:hover:bg-accent [&::-webkit-scrollbar-thumb]:transition-all
                [&::-webkit-scrollbar-thumb]:cursor-default [&::-webkit-scrollbar-track]:bg-light-background
                [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-thumb]:bg-card-border max-h-30`
            }
        >
            {list}
        </div>
    );
}