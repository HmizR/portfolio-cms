"use client";
import { Button } from "@/components/ui/button";
import { deleteProjectAction } from "@/features/projects/actions";
export function DeleteProjectForm({ id, title }: { id: string; title: string }) { const action = deleteProjectAction.bind(null, id); return <form action={action} onSubmit={(event) => { if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) event.preventDefault(); }}><Button className="bg-red-700 hover:bg-red-600" type="submit">Delete project</Button></form>; }
