import {expect, describe, it} from "vitest";
import classBuilder from "@/lib/classBuilder";

const cb = classBuilder;

describe("classBuilder", () => {
    it("simple strings", () => {
        expect(cb("test", "test")).toBe("test test");
        expect(cb("test", "")).toBe("test");
        expect(cb(" ", "")).toBe("");
    });
    it("simple booleans", () => {
        const i = 0;
        expect(cb([true, "t"])).toBe("t");
        expect(cb([false, "test"])).toBe("");
        expect(cb(
            [false, "a"],
            "b",
            [i === 0, "c"],
            [typeof null === "object", "d"]
        )).toBe("b c d");
    });
    it("nullish values", () => {
        let i:number | undefined = 5;
        expect(cb([!i, "t"])).toBe("");
        i = undefined;
        expect(cb([!i, "t"])).toBe("t");
    });
    it("mixed expressions", () => {
        const messages: string[] = ["a", "b", "c"];
        let i: null | string = null;
        expect(cb([!!messages, "a"], [messages[2] === "a", "b"], "c", [!i, "d"])).toBe("a c d");
        i = "goo";
        const obj = {a: 1};
        expect(cb([{}, "a"], [obj, "b"], [!i, "c"], [[], "d"])).toBe("a b d");
    });
});
