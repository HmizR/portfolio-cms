"use client";

import { Button } from "@/components/ui/button";
import { deletePostAction } from "@/features/posts/actions";

export function DeletePostForm({ id, title }: { id: string; title: string }) {
  const action = deletePostAction.bind(null, id);
  return <form action={action} onSubmit={(event) => { if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) event.preventDefault(); }}><Button className="bg-red-700 hover:bg-red-600" type="submit">Delete post</Button></form>;
}
