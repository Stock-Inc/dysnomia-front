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
    const message = crypto.randomUUID().toString();
    test("should be able to load public chat and send a message", async ({page}) => {
        await expect(page.getByPlaceholder("Write a message...")).toBeVisible();
        await page.getByPlaceholder("Write a message...").fill(message);
        await page.getByLabel("Send button").click();
        await expect(page.getByText(message).filter({visible: true})).toBeVisible();
    });
});