import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Dr. Maya Chen | Human-centered AI researcher",
  description:
    "Academic portfolio of Dr. Maya Chen, a researcher working across human-computer interaction, learning sciences, and responsible AI.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
