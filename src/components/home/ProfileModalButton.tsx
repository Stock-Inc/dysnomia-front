"use client";
import React from "react";
import classBuilder from "@/lib/classBuilder";
import Link from "next/link";

export default function ProfileModalButton(
    {
        children,
        onClickAction,
        dangerous = false,
        href,
    }:
    {
        children: React.ReactNode,
        href?: string,
        onClickAction?: () => void,
        dangerous?: boolean
    })
{
    return (
        <Link href={href ?? ""} onClick={onClickAction} className={classBuilder(
            `transition-all cursor-pointer hover:bg-card-border group 
            rounded-lg focus:outline-2 border-card-border border-2 flex space-x-5`,
            [dangerous, "hover:text-shadow-error-glow hover:text-error"],
            [!dangerous, "hover:text-shadow-white-glow"],
        )}>
            {children}
        </Link>
    );
}