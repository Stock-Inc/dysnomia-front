import {beforeEach, describe, vi, it, expect} from "vitest";
import {QueryClient} from "@tanstack/query-core";
import {render, screen, waitFor} from "@testing-library/react";
import ChatArea, {ChatMessage} from "@/components/home/chat/ChatArea";
import useStompClient from "@/hook/useStompClient";
import {QueryClientProvider} from "@tanstack/react-query";

vi.mock("@/hook/useStompClient", () => ({
    default: vi.fn()
}));

vi.mock("@/lib/app-store", () => ({
    persistentStore: Object.assign(
        vi.fn((selector) => selector({
            cachedMessages: {},
            currentChatId: "chat1",
            username: "test",
            setCachedMessages: vi.fn()
        })),
        {
            getState: vi.fn(() => ({
                cachedMessages: {},
                currentChatId: "chat1",
                username: "test",
                setCachedMessages: vi.fn()
            }))
        }
    )
}));

const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}}
});

describe("ChatArea", () => {
    const messages: ChatMessage[] = [
        {id: 1, reply_id: undefined, message: "Hello", date: Date.now(), name: "test"},
        {id: 2, reply_id: 1, message: "Hi!", date: Date.now(), name: "otherUser"},
    ];

    beforeEach(() => {
        vi.mocked(useStompClient).mockReturnValue([
            messages,
            vi.fn(),
            vi.fn(),
        ]);
        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([
                    {command: "cmd", description: "test command"}
                ])
            })
        ) as never;
    });

    it("renders loading circles on load", () => {
        vi.mocked(useStompClient).mockReturnValue([null, vi.fn(), vi.fn()]);

        render(
            <QueryClientProvider client={queryClient}>
                <ChatArea/>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("loading-circles")).toBeTruthy();
    });

    it("removes the loading circles when there are no messages", async () => {
        vi.mocked(useStompClient).mockReturnValue([[], vi.fn(), vi.fn()]);

        render(
            <QueryClientProvider client={queryClient}>
                <ChatArea/>
            </QueryClientProvider>
        );

        await waitFor(() => {
                expect(screen.queryByTestId("loading-circles")).toBeFalsy();
        });
    });

    it("renders messages when they are there", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ChatArea/>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("Hello")).toBeTruthy();
            expect(screen.getByText("Hi!")).toBeTruthy();
        });
    });

    it("distinguishes between outer and local messages", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ChatArea/>
            </QueryClientProvider>
        );

        await waitFor(() => {
            const helloMessage = document.querySelector(".msgbg1 > div");
            const hiMessage = document.querySelector(".msgbg2 > div");

            expect(helloMessage?.className).toContain("place-self-end");
            expect(hiMessage?.className).toContain("place-self-start");
        });
    });
});