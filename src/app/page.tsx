"use client";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";
import {motion, useAnimate} from "motion/react";
import {stagger} from "motion/react";
import {useEffect} from "react";
import SplitText from "@/components/SplitText";

export default function Page() {

    const [scope, animate] = useAnimate();

    useEffect(() => {
        animate(".buttons", {opacity: 1, y: 0}, {duration: 0.5, ease: "backOut", delay: stagger(0.1)});
        const sloganElements = document.querySelectorAll(".slogan");
        animate(sloganElements, {opacity: 1, y: 0}, {duration: 0.3, delay: stagger(0.1)});
        const titleElements = document.querySelectorAll(".title");
        animate(titleElements, {opacity: 1, y: 0}, {duration: 0.3, delay: stagger(0.1)});
    }, [animate]);

    return (
        <div className="w-full h-screen flex flex-col justify-center">
            <div className="flex flex-col items-center justify-center p-6 font-main space-y-5">
                <motion.div
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, ease: "backOut", delay: 0.75}}
                    className={"flex mb-10 sm:mb-20 justify-center"}
                >
                    <Image
                        fetchPriority={"high"}
                        priority={true}
                        aria-label={"Dysnomia logo"}
                        className={"drop-shadow-accent max-sm:w-1/2"}
                        src={"./icon.svg"}
                        alt={"logo"}
                        width={200}
                        height={200} />
                </motion.div>
                <SplitText
                    ref={scope}
                    split={"symbol"}
                    initial={{opacity: 0}}
                    childrenClassName={"title"}
                    className={"md:text-5xl text-4xl"}>
                    Dysnomia
                </SplitText>
                <SplitText initial={{y: 10, opacity: 0}} ref={scope} childrenClassName={"slogan"}
                           className="md:text-2xl text-xl text-center">Free open source messenger that values your
                    <span className={"text-accent font-bold text-shadow-glow"}> privacy</span>.</SplitText>
                <div
                    ref={scope}
                    className="flex justify-evenly sm:space-x-10 max-sm:flex-col max-sm:space-y-4"
                >
                    <motion.div
                        className={"buttons h-fit w-fit place-self-center"}
                        initial={{opacity: 0, y: 50}}
                    >
                        <Link className={"h-fit place-self-center"} href={"/login"}><Button onClickAction={() => {}}>Get Started</Button></Link>
                    </motion.div>
                    <motion.div
                        className={"buttons h-fit w-fit place-self-center"}
                        initial={{opacity: 0, y: 50}}
                    >
                        <Button variant={"outline"} onClickAction={() => {}}>About Us</Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}