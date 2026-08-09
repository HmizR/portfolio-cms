"use client";

import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { updateNavigationItemAction } from "@/features/navigation/actions";
import { describeNavigationDestination } from "@/features/navigation/destination";
import { NavigationFields } from "@/features/navigation/navigation-fields";
import type { NavigationEditorItem, NavigationPageOption } from "@/features/navigation/queries";

export function NavigationItemEditor({
  item,
  index,
  isFirst,
  isLast,
  pages,
  pendingOrder,
  onDelete,
  onDragStart,
  onDrop,
  onMove,
}: {
  item: NavigationEditorItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  pages: NavigationPageOption[];
  pendingOrder: boolean;
  onDelete: (item: NavigationEditorItem) => void;
  onDragStart: (id: string) => void;
  onDrop: (targetId: string, draggedId: string) => void;
  onMove: (from: number, to: number) => void;
}) {
  const [state, action, pending] = useActionState(updateNavigationItemAction, {});
  const [type, setType] = useState(item.type);
  const idPrefix = `navigation-${item.id}`;

  return (
    <li
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      data-visible={item.isVisible}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => { event.preventDefault(); onDrop(item.id, event.dataTransfer.getData("text/plain")); }}
    >
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex min-w-0 items-start gap-2">
          <button
            aria-label={`Drag ${item.label} to reorder`}
            className="mt-0.5 cursor-grab rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 active:cursor-grabbing"
            draggable
            onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", item.id); onDragStart(item.id); }}
            type="button"
          >
            <GripVertical aria-hidden="true" className="size-5" />
          </button>
          <div className="min-w-0">
            <p className="font-semibold text-slate-950">{item.label}</p>
            <p className="truncate text-xs text-slate-500">{describeNavigationDestination(item)}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button aria-label={`Move ${item.label} up`} className="min-h-9 bg-white px-2 text-slate-700 shadow-none hover:bg-slate-100" disabled={pendingOrder || isFirst} onClick={() => onMove(index, index - 1)} type="button"><ArrowUp aria-hidden="true" className="size-4" /></Button>
          <Button aria-label={`Move ${item.label} down`} className="min-h-9 bg-white px-2 text-slate-700 shadow-none hover:bg-slate-100" disabled={pendingOrder || isLast} onClick={() => onMove(index, index + 1)} type="button"><ArrowDown aria-hidden="true" className="size-4" /></Button>
        </div>
      </div>
      <form action={action} aria-label={`Edit ${item.label}`} className="space-y-4">
        <input name="id" type="hidden" value={item.id} />
        {state.message ? <p aria-live="polite" className={state.status === "success" ? "text-sm font-medium text-emerald-700" : "text-sm font-medium text-red-700"}>{state.message}</p> : null}
        <NavigationFields defaultLabel={item.label} defaultPageId={item.pageId} defaultUrl={item.url} errors={state.fieldErrors} idPrefix={idPrefix} onTypeChange={setType} pages={pages} type={type} />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input className="size-4" defaultChecked={item.isVisible} name="isVisible" type="checkbox" /> Visible publicly</label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input className="size-4" defaultChecked={item.openNewTab} name="openNewTab" type="checkbox" /> Open in a new tab</label>
          </div>
          <div className="flex gap-2">
            <Button aria-label={`Delete ${item.label}`} className="border border-red-200 bg-white px-3 text-red-700 shadow-none hover:bg-red-50" disabled={pendingOrder} onClick={() => onDelete(item)} type="button"><Trash2 aria-hidden="true" className="mr-1.5 size-4" /> Delete</Button>
            <Button disabled={pending || pendingOrder} type="submit">{pending ? "Saving..." : "Save item"}</Button>
          </div>
        </div>
      </form>
    </li>
  );
}
