"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { createNavigationItemAction } from "@/features/navigation/actions";
import { NavigationFields } from "@/features/navigation/navigation-fields";
import type { NavigationPageOption } from "@/features/navigation/queries";
import type { NavigationType } from "@/features/navigation/validation";

export function NavigationCreateForm({ pages }: { pages: NavigationPageOption[] }) {
  const [state, action, pending] = useActionState(createNavigationItemAction, {});
  const [type, setType] = useState<NavigationType>(pages.length > 0 ? "page" : "external");

  return (
    <form action={action} aria-label="Add navigation item" className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Add navigation item</h2>
        <p className="mt-1 text-sm text-slate-600">Link to a custom page, a built-in portfolio section, or an external website.</p>
      </div>
      {state.message ? <p aria-live="polite" className={state.status === "success" ? "rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" : "rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"}>{state.message}</p> : null}
      <NavigationFields errors={state.fieldErrors} idPrefix="new-navigation" onTypeChange={setType} pages={pages} type={type} />
      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input className="size-4" defaultChecked name="isVisible" type="checkbox" /> Visible publicly</label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input className="size-4" name="openNewTab" type="checkbox" /> Open in a new tab</label>
      </div>
      <div className="flex justify-end"><Button disabled={pending || (type === "page" && pages.length === 0)} type="submit">{pending ? "Adding..." : "Add item"}</Button></div>
    </form>
  );
}
