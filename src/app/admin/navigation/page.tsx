import type { Metadata } from "next";

import { NavigationManager } from "@/features/navigation/navigation-manager";
import { listNavigationEditorItems, listNavigationPageOptions } from "@/features/navigation/queries";

export const metadata: Metadata = { title: "Navigation | PortfolioCMS" };

export default async function AdminNavigationPage() {
  const [items, pages] = await Promise.all([
    listNavigationEditorItems(),
    listNavigationPageOptions(),
  ]);
  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Website</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Navigation</h1>
      <p className="mb-8 mt-2 max-w-2xl text-slate-600">Control the links shown in the public header, including their destination, visibility, new-tab behavior, and order.</p>
      <NavigationManager initialItems={items} key={JSON.stringify(items)} pages={pages} />
    </div>
  );
}
