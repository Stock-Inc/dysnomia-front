import { motion } from "motion/react";
import React from "react";

export default function ConsoleBox(
    {
        input,
        output,
    }: {
        input: string;
        output: string;
    }
) {
    return (
        <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1 }}
            transition={{duration: 0.5}}
        >
            <div
                className={"text-lg rounded-2xl p-1 flex flex-col max-w-200 w-fit place-self-start rounded-bl-none bg-light-background"}
            >
                <div
                    className={`p-1 mx-1 line-clamp-2 overflow-hidden text-md rounded-r-xl 
                    bg-background border-l-4 border-foreground`}
                >
                    <p>{input}</p>
                </div>
                <p className={"p-1 wrap-anywhere"}>{output}</p>
            </div>
        </motion.div>
    );
}