"use client";
import React from "react";
import classBuilder from "@/lib/classBuilder";

export default function ProfileModalButton(
    {
        children,
        onClickAction,
        dangerous = false,
    }:
    {
        children: React.ReactNode,
        onClickAction: () => void,
        dangerous?: boolean
    })
{
    return (
        <button onClick={onClickAction} className={classBuilder(
            `transition-all cursor-pointer hover:bg-card-border group 
            rounded-lg focus:outline-2 border-card-border border-2 flex space-x-5 hover:text-shadow-white-glow`,
            ["hover:text-shadow-error-glow hover:text-error", dangerous])}>
            {children}
        </button>
    );
}