"use client";
import React from "react";

export default function Button(
    { children, onClickAction, variant = "accent", className }:
    {children: React.ReactNode, onClickAction: () => void, variant?: "accent" | "outline", className?: string }) {
    return (
        <button
            className={`${variant === "accent" ? "bg-accent text-white" :
                "border-2 border-accent bg-light-background text-accent hover:text-shadow-glow"} 
                rounded-2xl font-main text-center text-2xl cursor-pointer p-3
                hover:drop-shadow-accent hover:scale-105 transition-all max-md:text-xl
            ${className}`}
            aria-label={children?.toLocaleString() + " button"}
            onClick={onClickAction}>{children}</button>
    );
}