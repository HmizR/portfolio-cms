import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("completes setup, protects admin routes, and supports login and logout", async ({ page }) => {
test.setTimeout(900_000);
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

  await page.goto("/admin/posts");
  await expect(page.getByRole("heading", { name: "No posts yet" })).toBeVisible();
  await page.getByRole("link", { name: "Manage tags" }).click();
  const createTagForm = page.getByRole("form", { name: "Create tag" });
  await createTagForm.getByLabel("Name").fill("Research Notes");
  await createTagForm.getByRole("button", { name: "Create tag" }).click();
  await expect(page.getByRole("form", { name: "Edit Research Notes" })).toBeVisible();

  let tagForm = page.getByRole("form", { name: "Edit Research Notes" });
  await tagForm.getByLabel("Name").fill("Human AI");
  await tagForm.getByLabel("Slug").fill("human-ai");
  await tagForm.getByRole("button", { name: "Save" }).click();
  tagForm = page.getByRole("form", { name: "Edit Human AI" });
  await expect(tagForm.getByText("Tag saved.")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("form", { name: "Edit Human AI" })).toBeVisible();

  await createTagForm.getByLabel("Name").fill("Human AI");
  await createTagForm.getByLabel("Slug").fill("another-slug");
  await createTagForm.getByRole("button", { name: "Create tag" }).click();
  await expect(page.getByText("A tag already uses this name or slug.")).toBeVisible();

  await page.goto("/admin/posts/new");
  await page.getByLabel("Title").fill("Learning with AI");
  await page.getByRole("button", { name: "Create draft" }).click();
  await expect(page).toHaveURL(/\/admin\/posts\/[0-9a-f-]+$/, { timeout: 60_000 });
  const editPostUrl = page.url();
  const postPreviewHref = await page.getByRole("link", { name: /Preview public layout/ }).getAttribute("href");
  expect(postPreviewHref).toMatch(/^\/preview\/posts\/[0-9a-f-]+$/);
  if (!postPreviewHref) throw new Error("Post preview link is missing.");

  await page.goto("/admin/posts/new");
  await page.getByLabel("Title").fill("Duplicate learning post");
  await page.getByLabel("Slug").fill("learning-with-ai");
  await page.getByRole("button", { name: "Create draft" }).click();
  await expect(page.getByText("A post already uses this slug.")).toBeVisible();

  await page.goto(editPostUrl);
  await page.getByLabel("Excerpt").fill("A practical research note about thoughtful AI-assisted learning.");
  await page.getByLabel("Human AI").check();
  await page.locator(".cm-content").fill("# Learning deliberately\n\n**Reflection** matters when using intelligent tools.\n\n| Practice | Benefit |\n| --- | --- |\n| Question assumptions | Better judgment |");
  await expect(page.getByText(/^Saved \d/)).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Post saved.")).toBeVisible();
  expect((await page.request.get("/posts/learning-with-ai")).status()).toBe(404);
  await page.goto(postPreviewHref);
  await expect(page.getByText(/Private preview · draft/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Learning deliberately" })).toBeVisible();
  await expect(page.getByText("Human AI")).toBeVisible();

  await page.goto(editPostUrl);
  await page.getByRole("button", { name: "Publish" }).click();
  await expect(page.getByText("Post published.")).toBeVisible();
  await page.goto("/posts");
  await expect(page.getByRole("heading", { name: "Posts", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Learning with AI" })).toBeVisible();
  await expect(page.getByText("A practical research note about thoughtful AI-assisted learning.")).toBeVisible();
  await page.getByRole("link", { name: "Learning with AI" }).click();
  await expect(page.getByRole("heading", { name: "Learning with AI" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Learning deliberately" })).toBeVisible();
  await expect(page.getByText("Human AI")).toBeVisible();

  const publishedFeed = await page.request.get("/feed.xml");
  expect(publishedFeed.status()).toBe(200);
  expect(publishedFeed.headers()["content-type"]).toContain("application/rss+xml");
  expect(await publishedFeed.text()).toContain("Learning with AI");

  await page.goto(editPostUrl);
  await page.locator(".cm-content").fill("# Private post autosave\n\nThis is not public yet.");
  await expect(page.getByText(/^Saved \d/)).toBeVisible({ timeout: 30_000 });
  await page.goto("/posts/learning-with-ai");
  await expect(page.getByRole("heading", { name: "Learning deliberately" })).toBeVisible();
  await expect(page.getByText("This is not public yet.")).toHaveCount(0);

  await page.goto(editPostUrl);
  await page.getByRole("button", { name: "Archive" }).click();
  await expect(page.getByText("Post archived.")).toBeVisible();
  expect((await page.request.get("/posts/learning-with-ai")).status()).toBe(404);
  await page.goto("/posts");
  await expect(page.getByRole("link", { name: "Learning with AI" })).toHaveCount(0);
  expect(await (await page.request.get("/feed.xml")).text()).not.toContain("Learning with AI");

  await page.goto(editPostUrl);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete post" }).click();
  await expect(page).toHaveURL(/\/admin\/posts$/);
  await expect(page.getByRole("heading", { name: "No posts yet" })).toBeVisible();
  await page.goto("/admin/posts/tags");
  tagForm = page.getByRole("form", { name: "Edit Human AI" });
  await expect(tagForm.getByText("Used by 0 posts.")).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await tagForm.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("heading", { name: "No tags yet" })).toBeVisible();

  await page.goto("/admin/projects");
  await expect(page.getByRole("heading", { name: "No projects yet" })).toBeVisible();
  await page.getByRole("link", { name: "Manage technologies" }).click();
  const createTechnologyForm = page.getByRole("form", { name: "Create technology" });
  await createTechnologyForm.getByLabel("Name").fill("TypeScript");
  await createTechnologyForm.getByRole("button", { name: "Create technology" }).click();
  await expect(page.getByRole("form", { name: "Edit TypeScript" })).toBeVisible();

  let technologyForm = page.getByRole("form", { name: "Edit TypeScript" });
  await technologyForm.getByLabel("Name").fill("Responsible TypeScript");
  await technologyForm.getByLabel("Slug").fill("responsible-typescript");
  await technologyForm.getByRole("button", { name: "Save" }).click();
  technologyForm = page.getByRole("form", { name: "Edit Responsible TypeScript" });
  await expect(technologyForm.getByText("Technology saved.")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("form", { name: "Edit Responsible TypeScript" })).toBeVisible();

  await createTechnologyForm.getByLabel("Name").fill("Responsible TypeScript");
  await createTechnologyForm.getByLabel("Slug").fill("different-slug");
  await createTechnologyForm.getByRole("button", { name: "Create technology" }).click();
  await expect(page.getByText("A technology already uses this name or slug.")).toBeVisible();

  await page.goto("/admin/projects/new");
  await page.getByLabel("Title").fill("Civic AI Lab");
  await page.getByRole("button", { name: "Create draft" }).click();
  await expect(page).toHaveURL(/\/admin\/projects\/[0-9a-f-]+$/, { timeout: 60_000 });
  const editFeaturedProjectUrl = page.url();
  const projectPreviewHref = await page.getByRole("link", { name: /Preview public layout/ }).getAttribute("href");
  expect(projectPreviewHref).toMatch(/^\/preview\/projects\/[0-9a-f-]+$/);
  if (!projectPreviewHref) throw new Error("Project preview link is missing.");

  await page.goto("/admin/projects/new");
  await page.getByLabel("Title").fill("Duplicate civic project");
  await page.getByLabel("Slug").fill("civic-ai-lab");
  await page.getByRole("button", { name: "Create draft" }).click();
  await expect(page.getByText("A project already uses this slug.")).toBeVisible();

  await page.goto(editFeaturedProjectUrl);
  await page.getByLabel("Summary").fill("Participatory research tools for accountable public-interest AI.");
  await page.getByLabel("Project lifecycle").selectOption("active");
  await page.getByLabel("Featured project").check();
  await page.getByLabel("Start date").fill("2025-01-15");
  await page.getByLabel("GitHub URL").fill("https://github.com/example/civic-ai-lab");
  await page.getByLabel("Demo URL").fill("https://demo.example.com/civic-ai-lab");
  await page.getByLabel("External URL").fill("https://example.com/civic-ai-lab");
  await page.getByLabel("Responsible TypeScript").check();
  await page.locator(".cm-content").fill("# Participatory infrastructure\n\nThe lab builds **auditable tools** with community partners.");
  await expect(page.getByText(/^Saved \d/)).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Project saved.")).toBeVisible();
  expect((await page.request.get("/projects/civic-ai-lab")).status()).toBe(404);
  await page.goto(projectPreviewHref);
  await expect(page.getByText(/Private preview · draft/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Participatory infrastructure" })).toBeVisible();
  await expect(page.getByText("Responsible TypeScript")).toBeVisible();
  await expect(page.getByText(/Project · active/)).toBeVisible();

  await page.goto(editFeaturedProjectUrl);
  await page.getByRole("button", { name: "Publish" }).click();
  await expect(page.getByText("Project published.")).toBeVisible();

  await page.goto("/admin/projects/new");
  await page.getByLabel("Title").fill("Archive Toolkit");
  await page.getByRole("button", { name: "Create draft" }).click();
  await expect(page).toHaveURL(/\/admin\/projects\/[0-9a-f-]+$/, { timeout: 60_000 });
  const editRegularProjectUrl = page.url();
  await page.getByLabel("Summary").fill("A compact tool for preserving research artifacts.");
  await page.getByLabel("Project lifecycle").selectOption("completed");
  await page.getByLabel("Start date").fill("2026-01-01");
  await page.getByLabel("End date").fill("2026-05-01");
  await page.getByRole("button", { name: "Publish" }).click();
  await expect(page.getByText("Project published.")).toBeVisible();

  await page.goto("/projects");
  await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();
  await expect(page.locator("ol > li").first().getByRole("link", { name: "Civic AI Lab" })).toBeVisible();
  await expect(page.locator("ol > li").nth(1).getByRole("link", { name: "Archive Toolkit" })).toBeVisible();
  await page.getByRole("link", { name: "Civic AI Lab" }).click();
  await expect(page.getByRole("heading", { name: "Participatory infrastructure" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Source/ })).toHaveAttribute("target", "_blank");
  await expect(page.getByRole("link", { name: /Demo/ })).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.getByText("Responsible TypeScript")).toBeVisible();

  await page.goto(editFeaturedProjectUrl);
  await page.locator(".cm-content").fill("# Private project autosave\n\nThis is not public yet.");
  await expect(page.getByText(/^Saved \d/)).toBeVisible({ timeout: 30_000 });
  await page.goto("/projects/civic-ai-lab");
  await expect(page.getByRole("heading", { name: "Participatory infrastructure" })).toBeVisible();
  await expect(page.getByText("This is not public yet.")).toHaveCount(0);

  await page.goto(editFeaturedProjectUrl);
  await page.getByRole("button", { name: "Archive" }).click();
  await expect(page.getByText("Project archived.")).toBeVisible();
  expect((await page.request.get("/projects/civic-ai-lab")).status()).toBe(404);
  await page.goto("/projects");
  await expect(page.getByRole("link", { name: "Civic AI Lab" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Archive Toolkit" })).toBeVisible();

  await page.goto(editFeaturedProjectUrl);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete project" }).click();
  await expect(page).toHaveURL(/\/admin\/projects$/);
  await page.goto("/admin/projects/technologies");
  technologyForm = page.getByRole("form", { name: "Edit Responsible TypeScript" });
  await expect(technologyForm.getByText("Used by 0 projects.")).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await technologyForm.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("heading", { name: "No technologies yet" })).toBeVisible();

  await page.goto("/admin/education");
  await page.getByLabel("Institution", { exact: true }).fill("Chulalongkorn University");
  await page.getByLabel("Degree").fill("MSc");
  await page.getByLabel("Field").fill("Computer Science");
  await page.getByLabel("Start date").fill("2024-08-01");
  await page.getByLabel("Currently studying").check();
  await page.getByLabel("Markdown description").fill("Research in **responsible AI**.");
  await page.getByRole("button", { name: "Add education" }).click();
  await expect(page.getByText("Education added.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Chulalongkorn University" })).toBeVisible();

  await page.goto("/admin/experience");
  await page.getByLabel("Organization", { exact: true }).fill("Civic Technology Lab");
  await page.getByLabel("Position", { exact: true }).fill("Research Engineer");
  await page.getByLabel("Currently working").check();
  await page.getByRole("button", { name: "Add experience" }).click();
  await expect(page.getByText("Experience added.")).toBeVisible();

  await page.goto("/admin/skills");
  await page.getByLabel("Skill").fill("TypeScript");
  await page.getByLabel("Category").fill("Languages");
  await page.getByRole("button", { name: "Add skill" }).click();
  await expect(page.getByText("Skill added.")).toBeVisible();
  await expect(page.locator('input[value="TypeScript"]')).toBeVisible();

  await page.goto("/admin/media");
  await expect(page.getByText("No media found. Upload the first file to build your library.")).toBeVisible();
  const pdfUpload = await page.request.post("/api/admin/media", { multipart: { file: { name: "publication-paper.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n%%EOF") } } });
  expect(pdfUpload.ok()).toBe(true);

  await page.goto("/admin/publications/new");
  await page.getByLabel("Title").fill("Accountable AI Infrastructure");
  await page.getByRole("button", { name: "Create private draft" }).click();
  await expect(page).toHaveURL(/\/admin\/publications\/[0-9a-f-]+$/, { timeout: 180_000 });
  const editPublicationUrl = page.url();
  await page.getByLabel("Type").selectOption("conference");
  await page.getByLabel("Publication date").fill("2026-08-11");
  await page.getByLabel("Venue").fill("Conference on Responsible Computing");
  await page.getByLabel("Abstract").fill("A practical architecture for accountable public-interest systems.");
  await page.getByLabel("Featured publication").check();
  await page.getByLabel("DOI").fill("10.1000/accountable-ai");
  await page.getByRole("button", { name: "Add author" }).click();
  await page.getByLabel("Author 1 name").fill("Maya Chen");
  await page.getByLabel("Author 1 profile URL").fill("https://example.com/maya");
  await page.getByLabel("Owner").check();
  await page.getByRole("button", { name: "Add author" }).click();
  await page.getByLabel("Author 2 name").fill("Grace Hopper");
  await page.getByRole("button", { name: "Move Grace Hopper up" }).click();
  await page.getByRole("button", { name: "Choose PDF" }).click();
  await page.getByRole("dialog", { name: "Media picker" }).getByRole("button", { name: /publication-paper\.pdf/ }).click();
  await page.locator(".cm-content").fill("# Methods\n\nThe study uses **participatory evaluation**.");
  await expect(page.getByText(/^Saved \d/)).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Publish" }).click();
  await expect(page.getByText("Publication published.")).toBeVisible();
  await page.goto("/publications");
  await expect(page.getByRole("link", { name: "Accountable AI Infrastructure" })).toBeVisible();
  await page.getByRole("link", { name: "Accountable AI Infrastructure" }).click();
  await expect(page.getByRole("heading", { name: "Methods" })).toBeVisible();
  await expect(page.getByRole("link", { name: /PDF/ })).toHaveAttribute("href", /\/media\/[0-9a-f-]+/);
  await expect(page.getByRole("link", { name: "Maya Chen", exact: true })).toBeVisible();
  await expect(page.locator("article header")).toContainText("Grace Hopper, Maya Chen");

  await page.goto(editRegularProjectUrl);
  await page.getByLabel("Featured project").check();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Project saved.")).toBeVisible();

  await page.goto("/admin/homepage");
  await expect(page.getByRole("heading", { name: "Homepage" })).toBeVisible();
  const markdownSection = page.locator('[data-section-type="markdown"]');
  await markdownSection.getByLabel("Markdown introduction heading").fill("Research overview");
  await markdownSection.locator(".cm-content").fill("## Human-centered systems\n\nI build **accountable research tools** with public-interest partners.");
  await page.getByRole("button", { name: "Show Education" }).click();
  await page.getByRole("button", { name: "Show Experience" }).click();
  await page.getByRole("button", { name: "Move Experience up" }).click();
  await page.getByRole("button", { name: "Save homepage" }).click();
  await expect(page.getByText("Homepage configuration saved.")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "Hide Education" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hide Experience" })).toBeVisible();
  await expect(page.locator('[data-section-type="experience"]')).toHaveAttribute("data-section-type", "experience");
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Research overview" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Human-centered systems" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Archive Toolkit" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Accountable AI Infrastructure" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Education" })).toBeVisible();

  await page.goto("/admin/cv");
  await expect(page.getByRole("heading", { name: "Curriculum vitae" })).toBeVisible();
  await page.getByRole("button", { name: "Move Experience up" }).click();
  await page.getByRole("button", { name: "Hide Education" }).click();
  await page.getByRole("checkbox", { name: /Archive Toolkit/ }).check();
  await page.getByRole("button", { name: "Save CV" }).click();
  await expect(page.getByText("CV configuration saved.")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "Show Education" })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /Archive Toolkit/ })).toBeChecked();
  const cvSectionItems = page.getByRole("form", { name: "Configure CV" }).locator("ol > li");
  await expect(cvSectionItems.nth(1)).toContainText("Experience");
  await expect(cvSectionItems.nth(2)).toContainText("Education");
  await page.goto("/cv");
  await expect(page.getByRole("heading", { name: "Dr. Maya Chen" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Education" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Archive Toolkit" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Accountable AI Infrastructure" })).toBeVisible();
  await expect(page.getByText("TypeScript", { exact: true })).toBeVisible();
  await expect(page.locator(".cv-document h2")).toHaveText(["Experience", "Selected Projects", "Publications", "Skills"]);
  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("banner")).toBeHidden();
  await expect(page.getByRole("contentinfo")).toBeHidden();
  await expect(page.getByRole("button", { name: "Print or save PDF" })).toBeHidden();
  const cvPdf = await page.pdf({ format: "A4", printBackground: true });
  expect(cvPdf.subarray(0, 4).toString()).toBe("%PDF");
  expect(cvPdf.byteLength).toBeGreaterThan(1_000);
  await page.emulateMedia({ media: "screen" });
  await page.goto(editRegularProjectUrl);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete project" }).click();
  await expect(page.getByRole("heading", { name: "No projects yet" })).toBeVisible();

  await page.goto(editPublicationUrl);
  await page.getByRole("button", { name: "Archive" }).click();
  await expect(page.getByText("Publication archived.")).toBeVisible();
  await expect(page.getByText(/^Saved \d/)).toBeVisible({ timeout: 30_000 });
  expect((await page.request.get("/publications/accountable-ai-infrastructure")).status()).toBe(404);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete publication" }).click();
  await expect(page).toHaveURL(/\/admin\/publications$/);
  await expect(page.getByRole("heading", { name: "No publications yet" })).toBeVisible();

  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");
  await page.goto("/admin/media");
  await expect(page.getByRole("button", { name: /publication-paper\.pdf/ })).toBeVisible();
  await page.getByTestId("media-file-input").setInputFiles({ name: "research-figure.png", mimeType: "image/png", buffer: png });
  await expect(page.getByText("Upload complete.")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("button", { name: /research-figure\.png/ })).toBeVisible();
  await expect(page.getByText(/1×1/)).toBeVisible();
  await page.getByLabel("Alternative text").fill("Research workflow diagram");
  await page.getByRole("button", { name: "Save alternative text" }).click();
  await expect(page.getByText("Alternative text saved.")).toBeVisible();
  await page.getByLabel("Search media").fill("workflow");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("button", { name: /research-figure\.png/ })).toBeVisible();

  await page.goto("/admin/pages/new");
  await page.getByLabel("Title").fill("Media research note");
  await page.getByRole("button", { name: "Create draft" }).click();
  await expect(page).toHaveURL(/\/admin\/pages\/[0-9a-f-]+$/, { timeout: 60_000 });
  await page.getByRole("button", { name: "Image", exact: true }).click();
  const mediaPicker = page.getByRole("dialog", { name: "Media picker" });
  await expect(mediaPicker).toBeVisible();
  await mediaPicker.getByRole("button", { name: /research-figure\.png/ }).click();
  await expect(page.locator(".cm-content")).toContainText("Research workflow diagram");

  await page.getByRole("button", { name: "Publish" }).click();
  await expect(page.getByText("Page published.")).toBeVisible();
  await page.goto("/media-research-note");
  await expect(page.getByRole("img", { name: "Research workflow diagram" })).toBeVisible();

  await page.goto("/admin/homepage");
  await page.getByLabel("Custom page excerpt page").selectOption({ label: "Media research note" });
  await page.getByRole("button", { name: "Show Custom page excerpt" }).click();
  await page.getByRole("button", { name: "Save homepage" }).click();
  await expect(page.getByText("Homepage configuration saved.")).toBeVisible();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "More about my work" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Media research note" })).toBeVisible();

  await page.goto("/admin/media");
  await page.getByRole("button", { name: /research-figure\.png/ }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete media" }).click();
  await expect(page.getByText("research-figure.png")).toHaveCount(0);

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
