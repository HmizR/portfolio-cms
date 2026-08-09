import { describe, expect, it } from "vitest";

import { renderMarkdown } from "@/lib/markdown/render";

describe("shared Markdown renderer", () => {
  it("supports GFM, footnotes, heading anchors, code, math, and Mermaid", async () => {
    const html = await renderMarkdown(`# Research Notes

| Method | Result |
| --- | --- |
| RAG | Strong |

- [x] Replicated

Term[^1]

[^1]: Supporting note.

\`\`\`ts
const answer: number = 42
\`\`\`

$E = mc^2$

\`\`\`mermaid
graph LR
  A --> B
\`\`\``);

    expect(html).toContain('id="research-notes"');
    expect(html).toContain("<table>");
    expect(html).toContain('type="checkbox"');
    expect(html).toContain("data-footnote-ref");
    expect(html).toContain('class="shiki github-light"');
    expect(html).toContain('class="katex"');
    expect(html).toContain('class="mermaid"');
  }, 20_000);

  it("drops raw HTML and unsafe URL protocols", async () => {
    const html = await renderMarkdown(`<script>alert('xss')</script>

<img src=x onerror=alert(1)>

[unsafe](javascript:alert(1))

![safe](https://example.com/image.png)`);

    expect(html).not.toContain("<script");
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("https://example.com/image.png");
  });
});
