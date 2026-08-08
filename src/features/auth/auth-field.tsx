import type { ComponentProps } from "react";

import { Input } from "@/components/ui/input";

interface AuthFieldProps extends ComponentProps<typeof Input> {
  label: string;
  errors?: string[];
}

export function AuthField({ errors, id, label, ...inputProps }: AuthFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-800" htmlFor={id}>
        {label}
      </label>
      <Input
        aria-describedby={errors?.length ? errorId : undefined}
        aria-invalid={Boolean(errors?.length)}
        id={id}
        {...inputProps}
      />
      {errors?.map((error) => (
        <p className="text-sm text-red-700" id={errorId} key={error}>
          {error}
        </p>
      ))}
    </div>
  );
}
