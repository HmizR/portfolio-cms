"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { NavigationPageOption } from "@/features/navigation/queries";
import { navigationTypeSchema, type NavigationActionState, type NavigationType } from "@/features/navigation/validation";
import { FormField } from "@/features/profile/form-field";

export const navigationTypeOptions: Array<{ label: string; value: NavigationType }> = [
  { value: "page", label: "Custom page" },
  { value: "posts", label: "Posts" },
  { value: "projects", label: "Projects" },
  { value: "publications", label: "Publications" },
  { value: "cv", label: "CV" },
  { value: "external", label: "External URL" },
];

export function NavigationFields({
  defaultLabel,
  defaultPageId,
  defaultUrl,
  errors,
  idPrefix,
  pages,
  type,
  onTypeChange,
}: {
  defaultLabel?: string;
  defaultPageId?: string | null;
  defaultUrl?: string | null;
  errors?: NavigationActionState["fieldErrors"];
  idPrefix: string;
  pages: NavigationPageOption[];
  type: NavigationType;
  onTypeChange: (type: NavigationType) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField errors={errors?.label} htmlFor={`${idPrefix}-label`} label="Label">
        <Input defaultValue={defaultLabel} id={`${idPrefix}-label`} maxLength={80} name="label" required />
      </FormField>
      <FormField errors={errors?.type} htmlFor={`${idPrefix}-type`} label="Destination type">
        <Select id={`${idPrefix}-type`} name="type" onChange={(event) => {
          const parsed = navigationTypeSchema.safeParse(event.target.value);
          if (parsed.success) onTypeChange(parsed.data);
        }} value={type}>
          {navigationTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
      </FormField>
      {type === "page" ? (
        <div className="sm:col-span-2">
          <FormField description="Unpublished pages can be selected but remain hidden from the public navbar." errors={errors?.pageId} htmlFor={`${idPrefix}-page`} label="Page">
            <Select defaultValue={defaultPageId ?? ""} disabled={pages.length === 0} id={`${idPrefix}-page`} name="pageId" required>
              <option disabled value="">{pages.length === 0 ? "Create a page first" : "Choose a page"}</option>
              {pages.map((page) => <option key={page.id} value={page.id}>{page.title} (/{page.slug}, {page.status})</option>)}
            </Select>
          </FormField>
        </div>
      ) : null}
      {type === "external" ? (
        <div className="sm:col-span-2">
          <FormField errors={errors?.url} htmlFor={`${idPrefix}-url`} label="External URL">
            <Input defaultValue={defaultUrl ?? ""} id={`${idPrefix}-url`} name="url" placeholder="https://example.com" required type="url" />
          </FormField>
        </div>
      ) : null}
    </div>
  );
}
