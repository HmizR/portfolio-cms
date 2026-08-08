import type { ReactNode } from "react";

import { PublicShell } from "@/components/public/public-shell";
import { publicShellFixture } from "@/features/public-shell/public-shell.fixtures";

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <PublicShell fixture={publicShellFixture}>{children}</PublicShell>;
}
