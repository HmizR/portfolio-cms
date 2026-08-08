"use client";

import { useActionState } from "react";

import { setupAction } from "@/features/auth/actions";
import { AuthField } from "@/features/auth/auth-field";
import { SubmitButton } from "@/features/auth/submit-button";

export function SetupForm() {
  const [state, action] = useActionState(setupAction, {});

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.message ? (
        <div aria-live="polite" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.message}
        </div>
      ) : null}
      <AuthField
        autoComplete="name"
        defaultValue={state.values?.name}
        errors={state.fieldErrors?.name}
        id="name"
        label="Your name"
        maxLength={100}
        name="name"
        required
      />
      <AuthField
        autoComplete="email"
        defaultValue={state.values?.email}
        errors={state.fieldErrors?.email}
        id="email"
        label="Email address"
        maxLength={254}
        name="email"
        required
        type="email"
      />
      <AuthField
        autoComplete="new-password"
        errors={state.fieldErrors?.password}
        id="password"
        label="Password"
        maxLength={128}
        minLength={12}
        name="password"
        required
        type="password"
      />
      <p className="-mt-3 text-xs leading-5 text-slate-500">Use at least 12 characters. Passwords are stored as secure one-way hashes.</p>
      <AuthField
        autoComplete="new-password"
        errors={state.fieldErrors?.confirmPassword}
        id="confirmPassword"
        label="Confirm password"
        maxLength={128}
        name="confirmPassword"
        required
        type="password"
      />
      <SubmitButton idleLabel="Create administrator" pendingLabel="Creating account…" />
    </form>
  );
}
