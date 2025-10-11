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
