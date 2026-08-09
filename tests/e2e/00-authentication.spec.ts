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

  await page.goto("/admin/profile");
  await page.getByLabel("Headline").fill("Researcher in human-centered artificial intelligence");
  await page.getByLabel("Location").fill("Bangkok, Thailand");
  await page.getByLabel("Avatar URL").fill("https://example.com/maya-avatar.jpg");
  await page.getByLabel("Short biography").fill("I study how intelligent systems can support learning and public understanding.");
  await page.getByRole("button", { name: "Add link" }).click();
  await page.getByLabel("Platform").fill("GitHub");
  await page.getByLabel("Public label").fill("GitHub");
  await page.getByLabel("URL", { exact: true }).fill("https://github.com/maya-chen");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByText("Profile and social links saved.")).toBeVisible();

  await page.goto("/admin/appearance");
  await page.getByLabel("Site title").fill("Maya Chen Research");
  await page.getByLabel("Site description").fill("Research in human-centered AI and learning sciences.");
  await page.getByLabel("Accent color").selectOption("blue");
  await page.getByLabel("Content width").selectOption("wide");
  await page.getByLabel("Profile image shape").selectOption("rounded");
  await page.getByLabel("Typography").selectOption("modern");
  await page.getByRole("button", { name: "Save appearance" }).click();
  await expect(page.getByText("Site identity and appearance saved.")).toBeVisible();
  await expect(page.getByLabel("Accent color")).toHaveValue("blue");
  await expect(page.getByLabel("Content width")).toHaveValue("wide");
  await expect(page.getByLabel("Profile image shape")).toHaveValue("rounded");
  await expect(page.getByLabel("Typography")).toHaveValue("modern");

  await page.reload();
  await expect(page.getByLabel("Accent color")).toHaveValue("blue");
  await expect(page.getByLabel("Content width")).toHaveValue("wide");
  await expect(page.getByLabel("Profile image shape")).toHaveValue("rounded");
  await expect(page.getByLabel("Typography")).toHaveValue("modern");

  await page.goto("/");
  await expect(page.getByRole("link", { name: "Maya Chen Research" })).toBeVisible();
  await expect(page.getByText("Researcher in human-centered artificial intelligence")).toBeVisible();
  await expect(page.getByRole("img", { name: "Profile image for Dr. Maya Chen" })).toHaveAttribute("src", "https://example.com/maya-avatar.jpg");
  await expect(page.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", "https://github.com/maya-chen");
  await expect(page).toHaveTitle("Maya Chen Research");
  await expect(page.locator(".public-site")).toHaveAttribute("data-accent", "blue");

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
