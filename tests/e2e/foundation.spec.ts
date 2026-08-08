import { expect, test } from "@playwright/test";

test("serves the foundation page and health endpoint", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Foundation ready" })).toBeVisible();

  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toEqual({ status: "ok" });
});
