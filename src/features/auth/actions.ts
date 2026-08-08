"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/features/auth/auth";
import { hasAdminUser } from "@/features/auth/queries";
import {
  clearLoginAttempts,
  consumeLoginAttempt,
  LOGIN_RATE_LIMIT_WINDOW_MINUTES,
} from "@/features/auth/rate-limit";
import { requireAdmin } from "@/features/auth/session";
import {
  type AuthFormState,
  loginSchema,
  setupSchema,
} from "@/features/auth/validation";

function formValues(formData: FormData) {
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
}

export async function setupAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (await hasAdminUser()) {
    return { message: "Setup is no longer available. Sign in instead." };
  }

  const parsed = setupSchema.safeParse(formValues(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
      },
    };
  }

  try {
    await auth.api.signUpEmail({
      headers: await headers(),
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      },
    });
  } catch (error) {
    console.error(
      "Admin setup failed.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return {
      message:
        "The administrator account could not be created. Setup may already be complete.",
      values: { name: parsed.data.name, email: parsed.data.email },
    };
  }

  redirect("/admin");
}

export async function loginAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse(formValues(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: { email: String(formData.get("email") ?? "") },
    };
  }

  try {
    if (!(await consumeLoginAttempt(parsed.data.email))) {
      return {
        message: `Too many sign-in attempts. Try again in ${LOGIN_RATE_LIMIT_WINDOW_MINUTES} minutes.`,
        values: { email: parsed.data.email },
      };
    }
  } catch (error) {
    console.error(
      "Login rate-limit check failed.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return {
      message: "Sign-in is temporarily unavailable. Please try again shortly.",
      values: { email: parsed.data.email },
    };
  }

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
    });
  } catch {
    return {
      message: "Email or password is incorrect. Please try again.",
      values: { email: parsed.data.email },
    };
  }

  await clearLoginAttempts(parsed.data.email);

  redirect("/admin");
}

export async function logoutAction(): Promise<never> {
  await requireAdmin();
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}
