"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPublicationAction } from "@/features/publications/actions";
import { FormField } from "@/features/profile/form-field";

export function CreatePublicationForm() { const [state, action, pending] = useActionState(createPublicationAction, {}); return <form action={action} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">{state.message ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{state.message}</p> : null}<FormField errors={state.fieldErrors?.title} htmlFor="title" label="Title"><Input defaultValue={state.values?.title} id="title" maxLength={300} name="title" required /></FormField><FormField description="Leave blank to generate it from the title." errors={state.fieldErrors?.slug} htmlFor="slug" label="Slug"><Input defaultValue={state.values?.slug} id="slug" maxLength={120} name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></FormField><div className="flex justify-end"><Button disabled={pending} type="submit">{pending ? "Creating..." : "Create private draft"}</Button></div></form>; }
