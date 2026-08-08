import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("completes setup, protects admin routes, and supports login and logout", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/setup$/);
  await expect(page.getByRole("heading", { name: "Create your administrator" })).toBeVisible();

  await page.getByLabel("Your name").fill("Dr. Maya Chen");
  await page.getByLabel("Email address").fill("maya@example.com");
  await page.getByLabel("Password", { exact: true }).fill("correct horse battery staple");
  await page.getByLabel("Confirm password").fill("correct horse battery staple");
  await page.getByRole("button", { name: "Create administrator" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Your workspace is ready" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.cookie)).not.toContain("portfoliocms");

  await page.goto("/setup");
  await expect(page).toHaveURL(/\/admin$/);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email address").fill("maya@example.com");
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Email or password is incorrect. Please try again.")).toBeVisible();

  await page.getByLabel("Password").fill("correct horse battery staple");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    await page.goto("/login");
    await page.getByLabel("Email address").fill("maya@example.com");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Email or password is incorrect. Please try again.")).toBeVisible();
  }

  await page.goto("/login");
  await page.getByLabel("Email address").fill("maya@example.com");
  await page.getByLabel("Password").fill("correct horse battery staple");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("Too many sign-in attempts. Try again in 15 minutes.")).toBeVisible();
});
