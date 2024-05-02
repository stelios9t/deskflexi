import { test, expect } from "@playwright/test";
const UI_URL = "http://localhost:5173";

test.beforeEach(
  async ({ page }) => {
    await page.goto(UI_URL);
    await page.getByRole("link", { name: "Sign In" }).click();
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
    await page.locator("[name=email]").fill("test@hotmail.com");
    await page.locator("[name=password]").fill("Password1!");
    await page.getByRole("button", { name: "Log In" }).click();
    await expect(page.getByText("Sign in Successful")).toBeVisible();
  },
  { timeout: 6000 }
);

test("should display users", async ({ page }) => {
  await page.goto(`${UI_URL}/my-users`);
  await expect(page.getByText("Stelios Tampouris")).toBeVisible();
  await expect(page.getByText("Role")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add User" })).toBeVisible();
});
