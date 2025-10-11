import { test, expect } from "@playwright/test";

test.describe("homepage", () => {
    test("navigating to login screen", async ({page}) => {
        await page.goto("http://localhost:3000");
        await expect(page.getByText("Get Started")).toBeVisible();
        await page.getByText("Get Started").click();
        await page.waitForURL("http://localhost:3000/login", {timeout: 10000});
        await expect(page.getByText("Login")).toBeVisible();
    });
});
