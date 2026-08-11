"use client";
import { Button } from "@/components/ui/button";
import { deletePublicationAction } from "@/features/publications/actions";
export function DeletePublicationForm({ id, title }: { id: string; title: string }) { const action = deletePublicationAction.bind(null, id); return <form action={action} onSubmit={(event) => { if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) event.preventDefault(); }}><Button className="bg-red-700 hover:bg-red-600" type="submit">Delete publication</Button></form>; }
