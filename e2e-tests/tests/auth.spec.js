import { test, expect } from "@playwright/test";
const UI_URL = "http://localhost:5173";
test("should allow the user to sign in", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await page.locator("[name=email]").fill("testing1@gmail.com");
  await page.locator("[name=password]").fill("password");
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.getByText("Sign in Successful")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});
//will fail now as there is no admin yet
// test("should allow the admin to sign in", async ({ page }) => {
//   await page.goto(UI_URL);
//   await page.getByRole("link", { name: "Sign In" }).click();
//   await page.getByRole("link", { name: "Admin Panel" }).click();
//   await expect(
//     page.getByRole("heading", { name: "Sign In - Admin Panel" })
//   ).toBeVisible();
//   await page.locator("[name=email]").fill("admin@gmail.com");
//   await page.locator("[name=password]").fill("password");
//   await page.getByRole("button", { name: "Log In" }).click();
//   await expect(page.getByText("Sign in Successful")).toBeVisible();
//   await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
//   await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
// });
// will be used as a generated email for the registering user test
// const testEmail = `test_register_${
//   Math.floor(Math.random() * 90000) + 10000
// }@test.com`;
