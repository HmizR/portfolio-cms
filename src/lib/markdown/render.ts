import "server-only";

import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import type { Element, Root } from "hast";
import { toText } from "hast-util-to-text";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import { unified } from "unified";
import { visit } from "unist-util-visit";

const highlighterPromise = createHighlighterCore({
  engine: createOnigurumaEngine(import("shiki/wasm")),
  themes: [import("@shikijs/themes/github-light")],
  langs: [
    import("@shikijs/langs/bash"),
    import("@shikijs/langs/c"),
    import("@shikijs/langs/cpp"),
    import("@shikijs/langs/csharp"),
    import("@shikijs/langs/css"),
    import("@shikijs/langs/go"),
    import("@shikijs/langs/html"),
    import("@shikijs/langs/java"),
    import("@shikijs/langs/javascript"),
    import("@shikijs/langs/jsx"),
    import("@shikijs/langs/json"),
    import("@shikijs/langs/markdown"),
    import("@shikijs/langs/python"),
    import("@shikijs/langs/rust"),
    import("@shikijs/langs/sql"),
    import("@shikijs/langs/typescript"),
    import("@shikijs/langs/tsx"),
    import("@shikijs/langs/yaml"),
  ],
});

function rehypeMermaid() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "pre") return;
      const code = node.children[0];
      if (!code || code.type !== "element" || code.tagName !== "code") return;

      const classes = code.properties.className;
      if (!Array.isArray(classes) || !classes.includes("language-mermaid")) return;

      node.properties = { className: ["mermaid"] };
      node.children = [{ type: "text", value: toText(code) }];
    });
  };
}

export async function renderMarkdown(markdown: string): Promise<string> {
  if (!markdown.trim()) return "";
  const highlighter = await highlighterPromise;

  const rendered = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    // Raw HTML is disabled by remark-rehype. Sanitize the untrusted HAST before
    // trusted rendering plugins add KaTeX/Shiki output.
    .use(rehypeSanitize)
    .use(rehypeSlug)
    .use(rehypeKatex, { strict: "warn" })
    .use(rehypeMermaid)
    .use(rehypeShikiFromHighlighter, highlighter, {
      theme: "github-light",
      defaultLanguage: "text",
      fallbackLanguage: "text",
    })
    .use(rehypeStringify)
    .process(markdown);

  return String(rendered);
}
