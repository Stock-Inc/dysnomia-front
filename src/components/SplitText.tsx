import {motion, VariantLabels} from "motion/react";
import {TargetAndTransition} from "motion";
import React, {useMemo} from "react";

export default function SplitText(
    {
        children,
        ref,
        initial,
        childrenClassName,
        className,
        split,
    }: {
        children: React.ReactNode;
        ref: React.RefObject<HTMLDivElement>;
        initial: boolean | undefined | TargetAndTransition | VariantLabels;
        childrenClassName: string;
        className?: string;
        split?: "word" | "symbol";
    }) {

    const toRender = useMemo(() => {
        const result: React.ReactNode[] = [];
        React.Children.map(children, child => {
            switch (typeof child) {
                case "bigint":
                case "boolean":
                case "number":
                case "symbol": {
                    result.push(
                        <motion.span
                            key={child + childrenClassName + child}
                            className={`${childrenClassName}`}
                            initial={initial}
                        >
                            {child + " "}
                        </motion.span>
                    );
                } break;
                case "string": {
                    if (!split || split === "word") {
                        child.split(" ").forEach((word, i) => {
                            result.push(
                                <motion.span
                                    key={i + word + childrenClassName}
                                    className={`${childrenClassName}`}
                                    initial={initial}
                                >
                                    {word + " "}
                                </motion.span>
                            );
                        });
                    } else {
                        child.split(" ").forEach((word, i) => {
                            word.split("").forEach((letter, i) => {
                                result.push(
                                    <motion.span
                                        key={i + word + childrenClassName + letter}
                                        className={`${childrenClassName}`}
                                        initial={initial}
                                    >
                                        {letter}
                                    </motion.span>
                                );
                            });
                            result.push(
                                <span key={i + word + childrenClassName}>
                                    {" "}
                                </span>
                            );
                        });
                    }
                } break;
                default: {
                    if (!child) return;
                    if (React.isValidElement(child)) {
                        const props = child.props as React.HTMLAttributes<HTMLElement>;
                        result.push(
                            <motion.span
                                key={(child.key ?? "child") + childrenClassName}
                                className={`${childrenClassName} ${props.className}`}
                                initial={initial}
                            >
                                {props.children}
                            </motion.span>
                        );
                    }
                }
            }
        });
        return result;
    }, [children]);

    return (
        <div ref={ref} className={className}>
            {
                toRender
            }
        </div>
    );
}
