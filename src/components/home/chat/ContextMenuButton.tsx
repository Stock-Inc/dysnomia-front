import {ReactNode} from "react";
import classBuilder from "@/lib/classBuilder";

export default function ContextMenuButton(
    {
        children,
        onClick,
        position,
        className,
        dangerous,
    }: {
        children: ReactNode,
        onClick?: () => void,
        position?: "top" | "bottom" | "middle",
        className?: string,
        dangerous?: boolean,
    }
) {
    return (
        <button
            className={
                classBuilder(
                    `bg-light-background p-2 border-2 border-card-border group
                    hover:bg-card-border transition-all flex space-x-2 cursor-pointer`,
                    [position === "top", "rounded-t-2xl"],
                    [position === "bottom", "rounded-b-2xl"],
                    [dangerous, "text-shadow-error-glow text-error"],
                    [!dangerous, "hover:text-shadow-white-glow"],
                    className
                )
            }
            onClick={onClick}
        >
            {children}
        </button>
    );
}