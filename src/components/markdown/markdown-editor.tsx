"use client";

import { markdown } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { Bold, Code2, Columns2, Expand, Eye, Heading2, Italic, Link, List, Minimize2, Pilcrow } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { MarkdownContent } from "@/components/markdown/markdown-content";
import { Button } from "@/components/ui/button";
import { findFirstImageFile, uploadMediaFile } from "@/features/media/client";
import { MediaPicker } from "@/features/media/media-picker";
import type { MediaRecord } from "@/features/media/queries";
import { cn } from "@/lib/utils";

type EditorMode = "markdown" | "preview" | "split";
type AutosaveResult = { ok: true; savedAt: string } | { ok: false; message: string };
type PreviewResult = { ok: true; html: string } | { ok: false; message: string };

interface MarkdownEditorProps {
  autosaveAction?: (input: unknown) => Promise<AutosaveResult>;
  contentId?: string;
  initialPreviewHtml: string;
  media?: MediaRecord[];
  onChange: (markdown: string) => void;
  previewAction: (markdown: unknown) => Promise<PreviewResult>;
  value: string;
}

const toolbarItems = [
  { label: "Heading", icon: Heading2, before: "## ", after: "" },
  { label: "Bold", icon: Bold, before: "**", after: "**" },
  { label: "Italic", icon: Italic, before: "_", after: "_" },
  { label: "Link", icon: Link, before: "[", after: "](https://example.com)" },
  { label: "List", icon: List, before: "- ", after: "" },
  { label: "Code", icon: Code2, before: "```text\n", after: "\n```" },
] as const;

export function MarkdownEditor({ autosaveAction, contentId, initialPreviewHtml, media = [], onChange, previewAction, value }: MarkdownEditorProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const initialValueRef = useRef(value);
  const lastSavedRef = useRef(value);
  const onEditorChange = useEffectEvent(onChange);
  const [mode, setMode] = useState<EditorMode>("markdown");
  const [expanded, setExpanded] = useState(false);
  const [previewHtml, setPreviewHtml] = useState(initialPreviewHtml);
  const [autosaveStatus, setAutosaveStatus] = useState("Saved");
  const [uploading, setUploading] = useState(false);

  function insertMarkdown(before: string, after: string) {
    const view = viewRef.current;
    if (!view) return;
    const range = view.state.selection.main;
    const selected = view.state.sliceDoc(range.from, range.to);
    const insertion = `${before}${selected}${after}`;
    view.dispatch({
      changes: { from: range.from, to: range.to, insert: insertion },
      selection: { anchor: range.from + before.length, head: range.from + before.length + selected.length },
      scrollIntoView: true,
    });
    view.focus();
  }

  function insertMedia(item: MediaRecord) {
    const altText = (item.altText || item.originalFilename.replace(/\.[^.]+$/, "")).replace(/[\[\]]/g, "");
    insertMarkdown(`![${altText}](${item.url})`, "");
  }

  const uploadAndInsert = useEffectEvent(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setAutosaveStatus("Only images can be inserted directly into Markdown");
      return;
    }
    setUploading(true);
    setAutosaveStatus("Uploading image...");
    try {
      insertMedia(await uploadMediaFile(file));
      setAutosaveStatus("Image uploaded and inserted");
    } catch (error) {
      setAutosaveStatus(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  });

  useEffect(() => {
    if (!mountRef.current) return;
    const view = new EditorView({
      parent: mountRef.current,
      state: EditorState.create({
        doc: initialValueRef.current,
        extensions: [
          basicSetup,
          markdown(),
          keymap.of([]),
          EditorView.lineWrapping,
          EditorView.theme({
            "&": { height: "100%", fontSize: "14px" },
            ".cm-content": { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", minHeight: "28rem", padding: "1rem" },
            ".cm-scroller": { overflow: "auto" },
            ".cm-gutters": { backgroundColor: "#f8fafc", borderRight: "1px solid #e2e8f0" },
            "&.cm-focused": { outline: "2px solid rgb(15 118 110 / 0.2)", outlineOffset: "-2px" },
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onEditorChange(update.state.doc.toString());
          }),
          EditorView.domEventHandlers({
            paste(event) {
              const image = findFirstImageFile(event.clipboardData?.files ?? []);
              if (!image) return false;
              event.preventDefault();
              void uploadAndInsert(image);
              return true;
            },
            dragover(event) {
              if (!Array.from(event.dataTransfer?.items ?? []).some((item) => item.kind === "file")) return false;
              event.preventDefault();
              return true;
            },
            drop(event) {
              const image = findFirstImageFile(event.dataTransfer?.files ?? []);
              if (!image) return false;
              event.preventDefault();
              void uploadAndInsert(image);
              return true;
            },
          }),
        ],
      }),
    });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view || view.state.doc.toString() === value) return;
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
  }, [value]);

  useEffect(() => {
    if (!autosaveAction || !contentId) return;
    if (value === lastSavedRef.current) return;
    setAutosaveStatus("Unsaved changes");
    const timeout = window.setTimeout(async () => {
      setAutosaveStatus("Saving...");
      const result = await autosaveAction({ id: contentId, contentMarkdown: value });
      if (result.ok) {
        lastSavedRef.current = value;
        setAutosaveStatus(`Saved ${new Date(result.savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
      } else {
        setAutosaveStatus(result.message);
      }
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, [autosaveAction, contentId, value]);

  useEffect(() => {
    if (mode === "markdown") return;
    const timeout = window.setTimeout(async () => {
      const result = await previewAction(value);
      if (result.ok) setPreviewHtml(result.html);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [mode, previewAction, value]);

  return (
    <section className={cn("overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm", expanded && "fixed inset-3 z-50 flex flex-col shadow-2xl sm:inset-6")}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2">
        <div className="flex flex-wrap gap-1">
          {toolbarItems.map((item) => <Button aria-label={item.label} className="h-9 bg-transparent px-2 text-slate-700 shadow-none hover:bg-slate-200" key={item.label} onClick={() => insertMarkdown(item.before, item.after)} title={item.label} type="button"><item.icon aria-hidden="true" className="size-4" /></Button>)}
          <MediaPicker imagesOnly initialMedia={media} onSelect={insertMedia} triggerLabel="Image" />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {(["markdown", "preview", "split"] as const).map((item) => <Button className={cn("h-9 gap-1.5 px-3 shadow-none", mode === item ? "bg-teal-800 text-white" : "bg-transparent text-slate-700 hover:bg-slate-200")} key={item} onClick={() => setMode(item)} type="button">{item === "markdown" ? <Pilcrow className="size-4" /> : item === "preview" ? <Eye className="size-4" /> : <Columns2 className="size-4" />}{item[0]?.toUpperCase()}{item.slice(1)}</Button>)}
          <Button aria-label={expanded ? "Exit expanded editor" : "Expand editor"} className="h-9 bg-transparent px-2 text-slate-700 shadow-none hover:bg-slate-200" onClick={() => setExpanded((current) => !current)} type="button">{expanded ? <Minimize2 className="size-4" /> : <Expand className="size-4" />}</Button>
        </div>
      </div>
      <div className={cn("grid min-h-[30rem]", expanded && "min-h-0 flex-1", mode === "split" && "lg:grid-cols-2")}>
        <div className={cn("min-w-0", mode === "preview" && "hidden", mode === "split" && "border-b border-slate-200 lg:border-b-0 lg:border-r")} ref={mountRef} />
        <div className={cn("min-w-0 overflow-auto p-5 sm:p-7", mode === "markdown" && "hidden")}><MarkdownContent html={previewHtml} /></div>
      </div>
      <div aria-live="polite" className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">{autosaveAction ? `${autosaveStatus}. ` : "Changes are saved with the surrounding form. "}{uploading ? "Keep this editor open while the image uploads." : "Drop or paste an image here."}</div>
    </section>
  );
}
