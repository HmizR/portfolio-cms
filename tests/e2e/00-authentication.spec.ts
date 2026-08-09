import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("completes setup, protects admin routes, and supports login and logout", async ({ page }) => {
  test.setTimeout(300_000);
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

  await page.goto("/admin/pages");
  await expect(page.getByRole("heading", { name: "No pages yet" })).toBeVisible();
  await page.getByRole("link", { name: "New page" }).click();
  await page.getByLabel("Title").fill("Hello");
  await page.getByRole("button", { name: "Create draft" }).click();
  await expect(page).toHaveURL(/\/admin\/pages\/[0-9a-f-]+$/, { timeout: 60_000 });
  const editPageUrl = page.url();
  const previewHref = await page.getByRole("link", { name: /Preview public layout/ }).getAttribute("href");
  expect(previewHref).toMatch(/^\/preview\/pages\/[0-9a-f-]+$/);
  if (!previewHref) throw new Error("Page preview link is missing.");

  await page.goto("/admin/pages/new");
  await page.getByLabel("Title").fill("Another page");
  await page.getByLabel("Slug").fill("hello");
  await page.getByRole("button", { name: "Create draft" }).click();
  await expect(page.getByText("A page already uses this slug.")).toBeVisible();
  await page.goto(editPageUrl);

  await page.getByLabel("Excerpt").fill("A Markdown rendering demonstration.");
  await page.locator(".cm-content").fill("# Hello from Markdown\n\n**Published content** with a footnote.[^1]\n\n| Feature | Status |\n| --- | --- |\n| Markdown | Working |\n\n```ts\nconst milestone = 4\n```\n\n$E = mc^2$\n\n[^1]: Draft preview note.");
  await expect(page.getByText(/^Saved \d/)).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: /Preview/ }).click();
  await expect(page.getByRole("heading", { name: "Hello from Markdown" })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("cell", { name: "Working" })).toBeVisible();

  const draftResponse = await page.request.get("/hello");
  expect(draftResponse.status()).toBe(404);
  await page.goto(previewHref);
  await expect(page.getByText(/Private preview \u00b7 draft/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Hello from Markdown" })).toBeVisible();

  await page.goto(editPageUrl);
  await page.getByRole("button", { name: "Publish" }).click();
  await expect(page.getByText("Page published.")).toBeVisible();
  await page.goto("/hello");
  await expect(page.getByRole("heading", { name: "Hello", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Hello from Markdown" })).toBeVisible();
  await expect(page.getByText("Published content")).toBeVisible();

  await page.goto("/admin/navigation");
  await expect(page.getByRole("heading", { name: "No navigation items yet" })).toBeVisible();
  const addNavigationForm = page.getByRole("form", { name: "Add navigation item" });
  await addNavigationForm.getByLabel("Label").fill("Hello");
  await addNavigationForm.getByLabel("Page").selectOption({ label: "Hello (/hello, published)" });
  await addNavigationForm.getByRole("button", { name: "Add item" }).click();
  await expect(page.getByRole("form", { name: "Edit Hello" })).toBeVisible();

  await addNavigationForm.getByLabel("Label").fill("Research Lab");
  await addNavigationForm.getByLabel("Destination type").selectOption("external");
  await addNavigationForm.getByLabel("External URL").fill("https://example.com/research");
  await addNavigationForm.getByLabel("Open in a new tab").check();
  await addNavigationForm.getByRole("button", { name: "Add item" }).click();
  await expect(page.getByRole("form", { name: "Edit Research Lab" })).toBeVisible();

  await addNavigationForm.getByLabel("Label").fill("Temporary CV");
  await addNavigationForm.getByLabel("Destination type").selectOption("cv");
  await addNavigationForm.getByRole("button", { name: "Add item" }).click();
  await expect(page.getByRole("form", { name: "Edit Temporary CV" })).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete Temporary CV" }).click();
  await expect(page.getByRole("form", { name: "Edit Temporary CV" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Move Research Lab up" })).toBeEnabled();

  const helloNavigationItem = page.locator("ol > li").filter({ has: page.getByRole("form", { name: "Edit Hello" }) });
  await page.getByRole("button", { name: "Drag Research Lab to reorder" }).dragTo(helloNavigationItem);
  await expect(page.locator("ol > li").first().getByRole("form", { name: "Edit Research Lab" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Move Hello up" })).toBeEnabled();
  const moveResearchDown = page.getByRole("button", { name: "Move Research Lab down" });
  await moveResearchDown.click();
  await expect(moveResearchDown).toBeDisabled();
  await expect(page.getByRole("button", { name: "Move Hello down" })).toBeEnabled();
  await page.reload();
  await expect(page.locator("ol > li").first().getByRole("form", { name: "Edit Hello" })).toBeVisible();

  await page.goto("/");
  const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(primaryNavigation.getByRole("link", { name: "Hello" })).toHaveAttribute("href", "/hello");
  await expect(primaryNavigation.getByRole("link", { name: "Research Lab" })).toHaveAttribute("target", "_blank");
  await expect(primaryNavigation.getByRole("link")).toHaveText(["Hello", "Research Lab"]);

  await page.goto("/admin/navigation");
  let helloNavigationForm = page.getByRole("form", { name: "Edit Hello" });
  await helloNavigationForm.getByLabel("Visible publicly").uncheck();
  await helloNavigationForm.getByRole("button", { name: "Save item" }).click();
  await expect(helloNavigationForm.locator("..")).toHaveAttribute("data-visible", "false");
  await page.reload();
  helloNavigationForm = page.getByRole("form", { name: "Edit Hello" });
  await expect(helloNavigationForm.getByLabel("Visible publicly")).not.toBeChecked();
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Hello" })).toHaveCount(0);
  expect((await page.request.get("/hello")).status()).toBe(200);

  await page.goto("/admin/navigation");
  helloNavigationForm = page.getByRole("form", { name: "Edit Hello" });
  await helloNavigationForm.getByLabel("Visible publicly").check();
  await helloNavigationForm.getByRole("button", { name: "Save item" }).click();
  await expect(helloNavigationForm.locator("..")).toHaveAttribute("data-visible", "true");
  await page.reload();
  await expect(page.getByRole("form", { name: "Edit Hello" }).getByLabel("Visible publicly")).toBeChecked();

  await page.goto(editPageUrl);
  await page.locator(".cm-content").fill("# Private autosave\n\nThis change is not public until explicitly saved.");
  await expect(page.getByText(/^Saved \d/)).toBeVisible({ timeout: 30_000 });
  await page.goto("/hello");
  await expect(page.getByText("Published content")).toBeVisible();
  await expect(page.getByText("This change is not public until explicitly saved.")).toHaveCount(0);
  await page.goto(previewHref);
  await expect(page.getByRole("heading", { name: "Private autosave" })).toBeVisible();

  await page.goto(editPageUrl);
  await page.getByRole("button", { name: "Archive" }).click();
  await expect(page.getByText("Page archived.")).toBeVisible();
  const archivedResponse = await page.request.get("/hello");
  expect(archivedResponse.status()).toBe(404);
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Hello" })).toHaveCount(0);

  await page.goto(editPageUrl);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete page" }).click();
  await expect(page).toHaveURL(/\/admin\/pages$/);
  await expect(page.getByRole("heading", { name: "No pages yet" })).toBeVisible();
  await page.goto("/admin/navigation");
  await expect(page.getByRole("form", { name: "Edit Hello" })).toHaveCount(0);
  await expect(page.getByRole("form", { name: "Edit Research Lab" })).toBeVisible();

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
