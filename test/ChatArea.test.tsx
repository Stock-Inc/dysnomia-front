import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {QueryClient} from "@tanstack/query-core";
import {cleanup, render, screen, waitFor} from "@testing-library/react";
import ChatArea, {ChatMessage} from "@/components/home/chat/ChatArea";
import useStompClient from "@/hook/useStompClient";
import {QueryClientProvider} from "@tanstack/react-query";
import {userEvent} from "@testing-library/user-event";

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

const user = userEvent.setup();

const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}}
});

describe("ChatArea", () => {
    const messages: ChatMessage[] = [
        {id: 1, reply_id: undefined, message: "Hello", date: Date.now(), name: "test"},
        {id: 2, reply_id: 1, message: "Hi!", date: Date.now(), name: "otherUser"},
    ];

    const fetchMock = vi.fn((url) => {
        switch (url) {
            case `${process.env.NEXT_PUBLIC_API_URL}/message/1`: return Promise.resolve(
                new Response(JSON.stringify({
                    id: 1,
                    name: "test",
                    message: "Hello",
                    reply_id: undefined,
                    date: Date.now()
                }), {status: 200})
            );
            case `${process.env.NEXT_PUBLIC_API_URL}/all_commands`: return Promise.resolve(
                new Response(JSON.stringify(
                    [
                        {
                            command: "cmd",
                            description: "description"
                        },
                        {
                            command: "another_cmd",
                            description: "another_description"
                        }
                    ]), {status: 200})
            );
        }
    });

    vi.stubGlobal("fetch", fetchMock);

    beforeEach(() => {
        vi.mocked(useStompClient).mockReturnValue([
            messages,
            vi.fn(),
            vi.fn(),
        ]);
    });

    afterEach(() => {
        cleanup();
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

    it("renders reply previews", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ChatArea/>
            </QueryClientProvider>
        );

        await waitFor(() => {
            const hiMessage = document.querySelector(".msgbg2 > div");

            expect(hiMessage?.innerHTML).toContain("Hello");
        });
    });

    it("renders command list when needed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ChatArea/>
            </QueryClientProvider>
        );

        await waitFor(() => {
            user.pointer({keys: "[MouseLeft]", target: screen.getByPlaceholderText("Write a message...")});
            user.keyboard("/");
            expect(screen.getByText("cmd")).toBeTruthy();
        });
    });
});