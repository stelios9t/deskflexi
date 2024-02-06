import { test, expect } from "@playwright/test";
import exp from "constants";
const UI_URL = "http://localhost:5173";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await page.locator("[name=email]").fill("testing1@gmail.com");
  await page.locator("[name=password]").fill("password");
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.getByText("Sign in Successful")).toBeVisible();
});

test("should allow admin to add a desk", async ({ page }) => {
  await page.goto(`${UI_URL}/add-desk`);
  await page.locator('[name="deskNumber"]').fill("300");
  await page.selectOption('[name="floor"]', "1");
  await page.getByLabel("3 Monitors").check();
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Desk Saved!")).toBeVisible({ timeout: 20000 });
});

//only one desk should exist in the database for the following test to pass because the "Floor locator will match
//multiple times if more desks are added in the database and therefore fail"
test("should display desks", async ({ page }) => {
  await page.goto(`${UI_URL}/my-desks`);
  await expect(page.getByText("Desk Number: 1")).toBeVisible();
  await expect(page.getByText("Floor")).toBeVisible();
  await expect(page.getByRole("link", { name: "View Details" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Desk" })).toBeVisible();
});
