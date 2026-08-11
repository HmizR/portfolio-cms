import { expect, test } from "@playwright/test";

test("renders the desktop public shell and health endpoint", async ({ page, request }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Studying how people learn with intelligent systems." }),
  ).toBeVisible();
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Dr. Maya Chen" })).toBeVisible();
  await expect(page.getByRole("contentinfo")).toContainText("Built with PortfolioCMS");
  await expect(page).toHaveTitle("Maya Chen Research");

  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await skipLink.focus();
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toEqual({ status: "ok" });
});

test("provides a keyboard-accessible mobile navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeHidden();
  const menuSummary = page.locator("summary");
  await menuSummary.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Research Lab", exact: true })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Dr. Maya Chen" })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("renders an intentional public not-found state", async ({ page }) => {
  const response = await page.goto("/missing-page");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Return to the homepage" })).toBeVisible();
});

test("protects private content previews from anonymous visitors", async ({ page }) => {
  await page.goto("/preview/pages/7fe4e8dd-8f22-4b9f-b19a-7cd4529f8d70");
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/preview/projects/7fe4e8dd-8f22-4b9f-b19a-7cd4529f8d70");
  await expect(page).toHaveURL(/\/login$/);
  const response = await page.request.get("/api/admin/media");
  expect(response.status()).toBe(401);
});
