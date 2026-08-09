export interface NavigationItemFixture {
  href: string;
  label: string;
}

export const publicNavigationFixture: NavigationItemFixture[] = [
    { href: "/#about", label: "About" },
    { href: "/#research", label: "Research" },
    { href: "/#writing", label: "Writing" },
    { href: "/#cv", label: "CV" },
];
