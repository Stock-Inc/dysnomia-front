"use client";
import React from "react";
import classBuilder from "@/lib/classBuilder";

export default function Button(
    {
        children, onClickAction, variant = "accent", className, type, disabled,
    }: {
        children: React.ReactNode, onClickAction?: () => void,
        variant?: "accent" | "outline", className?: string,
        type?: "submit" | "reset" | "button", disabled?: boolean
    }) {
    return (
        <button
            disabled={disabled}
            type={type}
            className={classBuilder(
                className,
                `rounded-2xl font-main text-center text-2xl cursor-pointer p-3 focus:outline-1
                 hover:drop-shadow-accent hover:scale-102 transition-all max-md:text-xl
                 disabled:cursor-default disabled:hover:drop-shadow-none disabled:hover:scale-100`,
                ["bg-accent text-white disabled:bg-dark-accent disabled:text-foreground focus:outline-white" , variant === "accent"],
                [`border-2 disabled:border-dark-accent border-accent bg-light-background
                 text-accent hover:text-shadow-glow disabled:text-dark-accent 
                 disabled:hover:text-shadow-none focus:outline-foreground`, variant === "outline"],
            )}
            onClick={onClickAction}>{children}</button>
    );
}