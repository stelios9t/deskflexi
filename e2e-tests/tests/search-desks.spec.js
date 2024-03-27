import { test, expect } from "@playwright/test";
const UI_URL = "http://localhost:5173";

test.beforeEach(
  async ({ page }) => {
    await page.goto(UI_URL);
    await page.getByRole("link", { name: "Sign In" }).click();
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
    await page.locator("[name=email]").fill("testing1@gmail.com");
    await page.locator("[name=password]").fill("password");
    await page.getByRole("button", { name: "Log In" }).click();
    await expect(page.getByText("Sign in Successful")).toBeVisible();
  },
  { timeout: 6000 }
);
test("should show desk search results", async ({ page }) => {
  await page.goto(UI_URL);
  await page
    .locator('input[placeholder="Search for a specific desk"]')
    .fill("1");

  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("D-1")).toBeVisible();
});

test("should book desk", async ({ page }) => {
  await page.goto(UI_URL);
  await page
    .locator('input[placeholder="Search for a specific desk"]')
    .fill("1");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("D-1")).toBeVisible();
  await page.getByRole("button", { name: "Book Desk" }).click();
  await expect(page.getByText("Booking Saved!")).toBeVisible();

  await page.getByRole("link", { name: "My Bookings" }).click();
  await expect(page.getByText("D-1")).toBeVisible();
});
