import React from "react";

export default function Loadable(
    {
        children,
        awaitedValue,
        fallback,
    }: {
        children: React.ReactNode,
        awaitedValue: unknown | undefined,
        fallback: React.ReactNode,
    })
{
    return (
        awaitedValue !== undefined ? children : fallback
    );
}