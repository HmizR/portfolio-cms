import type { ReactNode } from "react";

interface FormFieldProps {
  children: ReactNode;
  description?: string;
  errors?: string[];
  htmlFor: string;
  label: string;
}

export function FormField({ children, description, errors, htmlFor, label }: FormFieldProps) {
  const errorId = `${htmlFor}-error`;
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-800" htmlFor={htmlFor}>{label}</label>
      {children}
      {description ? <p className="text-xs leading-5 text-slate-500">{description}</p> : null}
      {errors?.map((error) => <p className="text-sm text-red-700" id={errorId} key={error}>{error}</p>)}
    </div>
  );
}
