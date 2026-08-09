"use client";

import { useRef, useState, useTransition } from "react";

import { deleteNavigationItemAction, reorderNavigationItemsAction } from "@/features/navigation/actions";
import { NavigationCreateForm } from "@/features/navigation/navigation-create-form";
import { NavigationItemEditor } from "@/features/navigation/navigation-item-editor";
import type { NavigationEditorItem, NavigationPageOption } from "@/features/navigation/queries";

function moveItem(items: NavigationEditorItem[], from: number, to: number): NavigationEditorItem[] {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  if (!moved) return items;
  next.splice(to, 0, moved);
  return next.map((item, sortOrder) => ({ ...item, sortOrder }));
}

export function NavigationManager({ initialItems, pages }: { initialItems: NavigationEditorItem[]; pages: NavigationPageOption[] }) {
  const [items, setItems] = useState(initialItems);
  const draggingId = useRef<string | null>(null);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function persistOrder(next: NavigationEditorItem[], previous: NavigationEditorItem[]) {
    setItems(next);
    setMessage("Saving navigation order...");
    startTransition(async () => {
      const result = await reorderNavigationItemsAction(next.map((item) => item.id));
      if (!result.ok) setItems(previous);
      setMessage(result.message);
    });
  }

  function handleMove(from: number, to: number) {
    const next = moveItem(items, from, to);
    if (next === items) return;
    persistOrder(next, items);
  }

  function handleDrop(targetId: string, transferredId: string) {
    const draggedId = transferredId || draggingId.current;
    if (!draggedId || draggedId === targetId) return;
    const from = items.findIndex((item) => item.id === draggedId);
    const to = items.findIndex((item) => item.id === targetId);
    draggingId.current = null;
    handleMove(from, to);
  }

  function handleDelete(item: NavigationEditorItem) {
    if (!window.confirm(`Delete "${item.label}" from navigation?`)) return;
    const previous = items;
    setItems((current) => current.filter((candidate) => candidate.id !== item.id));
    setMessage("Deleting navigation item...");
    startTransition(async () => {
      const result = await deleteNavigationItemAction(item.id);
      if (!result.ok) setItems(previous);
      setMessage(result.message);
    });
  }

  return (
    <div className="space-y-8">
      <NavigationCreateForm pages={pages} />
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><h2 className="font-serif text-2xl font-semibold">Configured navigation</h2><p className="mt-1 text-sm text-slate-600">Drag items into position or use the arrow buttons. Every order change is saved immediately.</p></div>
          <p aria-live="polite" className="text-sm font-medium text-slate-600">{message}</p>
        </div>
        {items.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center"><h3 className="font-serif text-xl font-semibold">No navigation items yet</h3><p className="mt-2 text-sm text-slate-600">Add the first item above. The public header stays uncluttered until then.</p></div>
        ) : (
          <ol className="mt-5 space-y-4">
            {items.map((item, index) => (
              <NavigationItemEditor
                index={index}
                isFirst={index === 0}
                isLast={index === items.length - 1}
                item={item}
                key={item.id}
                onDelete={handleDelete}
                onDragStart={(id) => { draggingId.current = id; }}
                onDrop={handleDrop}
                onMove={handleMove}
                pages={pages}
                pendingOrder={pending}
              />
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
