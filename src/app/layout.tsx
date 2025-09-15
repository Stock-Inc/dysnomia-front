import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import {Montserrat} from "next/font/google";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ['cyrillic']
});

const Dustismo = localFont({
    src: "./Dustismo.ttf",
    variable: "--font-dustismo",
    fallback: ["Montserrat"],
});



export const metadata: Metadata = {
    title: "Dysnomia",
    description: "Free open source chat application with a focus on privacy",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en">
            <body
                className={`${Dustismo.variable} antialiased selection:bg-highlight-background selection:text-highlight-text`}
            >
            {children}
        </body>
        </html>
    );
}
