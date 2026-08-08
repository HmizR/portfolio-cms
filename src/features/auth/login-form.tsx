"use client";

import { useActionState } from "react";

import { loginAction } from "@/features/auth/actions";
import { AuthField } from "@/features/auth/auth-field";
import { SubmitButton } from "@/features/auth/submit-button";

export function LoginForm() {
  const [state, action] = useActionState(loginAction, {});

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.message ? (
        <div aria-live="polite" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.message}
        </div>
      ) : null}
      <AuthField
        autoComplete="email"
        defaultValue={state.values?.email}
        errors={state.fieldErrors?.email}
        id="email"
        label="Email address"
        name="email"
        required
        type="email"
      />
      <AuthField
        autoComplete="current-password"
        errors={state.fieldErrors?.password}
        id="password"
        label="Password"
        name="password"
        required
        type="password"
      />
      <SubmitButton idleLabel="Sign in" pendingLabel="Signing in…" />
    </form>
  );
}
