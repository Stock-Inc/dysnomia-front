import {ReactNode, useMemo} from "react";
import Link from "next/link";
import classBuilder from "@/lib/classBuilder";

export default function P(
    {
        children,
        className,
        linkVariant,
    }: {
        children: ReactNode,
        className: string,
        linkVariant: "bio" | "message"
    }
) {
    const content = useMemo(() => {
        const tags = children?.toString().match(/@[a-zA-Z0-9_]*/gm);
        const output: (ReactNode | string)[] = [];
        if (!children || !tags) return children;
        let input = children.toString();
        for (const tag of tags) {
            const temp = input.split(tag);
            input = temp[1];
            output.push(temp[0]);
            output.push(
                <Link
                    className={
                        classBuilder(
                            "underline transition-all",
                            [linkVariant === "bio", "text-accent hover:text-shadow-glow"],
                            [linkVariant === "message", "hover:font-bold"]
                        )
                    }
                    key={tag}
                    href={`/profile/${tag.substring(1)}`}
                >
                    {tag}
                </Link>);
        }
        output.push(input);
        return (
            <p>
                {output}
            </p>
        );

    }, [children, linkVariant]);

    return (
        <div className={className}>
            {content}
        </div>
    );
}