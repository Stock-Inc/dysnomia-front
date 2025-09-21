"use client";
import React from "react";

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
            className={`${variant === "accent" ? "bg-accent text-white disabled:bg-dark-accent" +
                " disabled:text-foreground focus:outline-white" :
                "border-2 disabled:border-dark-accent border-accent bg-light-background text-accent hover:text-shadow-glow" +
                "disabled:text-dark-accent disabled:hover:text-shadow-none focus:outline-foreground"} 
                rounded-2xl font-main text-center text-2xl cursor-pointer p-3 focus:outline-1
                hover:drop-shadow-accent hover:scale-102 transition-all max-md:text-xl
                disabled:cursor-default disabled:hover:drop-shadow-none disabled:hover:scale-100
            ${className}`}
            //TODO: make it prettier
            aria-label={typeof children === "object" && "props" in children! ?
                (children! as React.ReactElement<{children: React.ReactNode}, never>).props.children?.toLocaleString() + " button" :
                children?.toLocaleString() + " button"}
            onClick={onClickAction}>{children}</button>
    );
}