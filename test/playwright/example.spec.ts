import { test, expect } from "@playwright/test";

test.describe("unauthorized", () => {
    test.use({storageState: ""});
    test("should navigate to login screen", async ({page}) => {
        await page.goto("http://localhost:3000");
        await expect(page.getByText("Get Started")).toBeVisible();
        await page.getByText("Get Started").click();
        await page.waitForURL("http://localhost:3000/login", {timeout: 10000});
        await expect(page.getByText("Login")).toBeVisible();
    });
    test("should be able to log in", async ({page}) => {
        await page.goto("http://localhost:3000/login");
        await expect(page.getByText("Login")).toBeVisible();
        await page.getByPlaceholder("Username").fill(process.env.PLAYWRIGHT_LOGIN!);
        await page.getByPlaceholder("Password").fill(process.env.PLAYWRIGHT_PASSWORD!);
        await page.getByText("Login").click();
        await page.waitForURL("http://localhost:3000/home", {timeout: 10000});
        await page.context().storageState({path: "auth.json"});
        await expect(page.getByText("Chats")).toBeVisible();
    });
});

test.describe("chat", () => {
    test.use({storageState: "auth.json"});
    test.beforeEach(async ({page}) => {
        await page.goto("http://localhost:3000/home");
        await expect(page.getByText("Chats")).toBeVisible();
        await page.getByText("public").click();
        await page.getByLabel("Toggle sidebar").click();
        await expect(page.getByText("Chats")).toHaveCSS("opacity", "0");
    });
    test("should be able to load public chat and send a message", async ({page}) => {
        const message = crypto.randomUUID().toString();
        await expect(page.getByPlaceholder("Write a message...")).toBeVisible();
        await page.getByPlaceholder("Write a message...").fill(message);
        await page.getByLabel("Send button").click();
        await expect(page.getByText(message).filter({visible: true})).toBeVisible();
    });
    // test("should be able to reply and do associated stuff", async ({page}) => {
    //     const message = crypto.randomUUID().toString();
    //     await page.getByText(process.env.PLAYWRIGHT_LOGIN!).nth(1).click({clickCount: 2});
    //     await expect(page.getByLabel("Cancel reply")).toBeVisible();
    //     await page.getByPlaceholder("Write a message...").fill(message);
    //     await page.getByLabel("Send button").click();
    //     const originalMessage = await page.getByText(message).getByText(process.env.PLAYWRIGHT_LOGIN!).textContent();
    //     await page.getByText(message).filter({hasText: process.env.PLAYWRIGHT_LOGIN!}).nth(0).click();
    //     await expect(page.getByText(originalMessage!)).toBeInViewport();
    // });
    test("should be able to go to the profile and back", async ({page}) => {
        await page.getByLabel("Open profile modal").click();
        await expect(page.getByRole("menu").filter({hasText: "Logged in as"})).toBeVisible();
        await page.getByText("Profile").click();
        await page.waitForURL(`http://localhost:3000/profile/${process.env.PLAYWRIGHT_LOGIN!}`, {timeout: 10000});
        await expect(page.getByText(`@${process.env.PLAYWRIGHT_LOGIN!}`)).toBeVisible();
        await page.getByLabel("Go back").click();
        await page.waitForURL("http://localhost:3000/home", {timeout: 10000});
        await expect(page.getByPlaceholder("Write a message...")).toBeVisible();
    });
});