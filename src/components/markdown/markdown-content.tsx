"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export function MarkdownContent({
  className,
  html,
}: {
  className?: string;
  html: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodes = rootRef.current?.querySelectorAll<HTMLElement>("pre.mermaid");
    if (!nodes?.length) return;

    let active = true;
    void import("mermaid").then(async ({ default: mermaid }) => {
      if (!active) return;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        suppressErrorRendering: true,
        theme: "neutral",
      });
      await mermaid.run({ nodes, suppressErrors: true });
    });

    return () => {
      active = false;
    };
  }, [html]);

  return (
    <div
      className={cn("markdown-content", className)}
      dangerouslySetInnerHTML={{ __html: html }}
      ref={rootRef}
    />
  );
}
