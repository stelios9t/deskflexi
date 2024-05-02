import { test, expect } from "@playwright/test";
const UI_URL = "http://localhost:5173";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await page.locator("[name=email]").fill("test@hotmail.com");
  await page.locator("[name=password]").fill("Password1!");
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.getByText("Sign in Successful")).toBeVisible();
});

test("should display desks", async ({ page }) => {
  await page.goto(`${UI_URL}/my-desks`);
  await expect(page.getByText("Desk Number: 1")).toBeVisible();
  await expect(page.getByText("Floor")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Desk" })).toBeVisible();
});
//test that edits a desk in the test database, the test automatically
//resets the number so it always passes
test("should edit desk", async ({ page }) => {
  await page.goto(`${UI_URL}/my-desks`);
  await page.getByRole("link", { name: "View Details" }).first().click();
  await page.waitForSelector('[name="deskNumber"]', { state: "attached" });
  await expect(page.locator('[name="deskNumber"]')).toHaveValue("1");
  await page.locator('[name="deskNumber"]').fill("11");
  await page.getByRole("button", { name: "Update Desk" }).click();
  await expect(page.getByText("Desk Saved!")).toBeVisible({ timeout: 30000 });
  await page.reload();
  await expect(page.getByText("Desk Number: 11")).toBeVisible();
  await page.getByRole("link", { name: "View Details" }).first().click();
  await page.waitForSelector('[name="deskNumber"]', { state: "attached" });
  await expect(page.locator('[name="deskNumber"]')).toHaveValue("11");
  await page.locator('[name="deskNumber"]').fill("1");
  await page.getByRole("button", { name: "Update Desk" }).click();
});
