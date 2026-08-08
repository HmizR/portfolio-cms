export interface NavigationItemFixture {
  href: string;
  label: string;
}

export interface SocialLinkFixture {
  href: string;
  label: string;
}

export interface PublicShellFixture {
  navigation: NavigationItemFixture[];
  owner: {
    avatarAlt: string;
    avatarSrc: string;
    biography: string;
    email: string;
    headline: string;
    location: string;
    name: string;
  };
  siteName: string;
  socialLinks: SocialLinkFixture[];
}

export const publicShellFixture: PublicShellFixture = {
  siteName: "Maya Chen",
  navigation: [
    { href: "/#about", label: "About" },
    { href: "/#research", label: "Research" },
    { href: "/#writing", label: "Writing" },
    { href: "/#cv", label: "CV" },
  ],
  owner: {
    avatarAlt: "Profile placeholder for Dr. Maya Chen",
    avatarSrc: "/avatar-placeholder.svg",
    biography:
      "I study how intelligent systems can support learning, decision-making, and public understanding without losing sight of the people they affect.",
    email: "maya.chen@example.edu",
    headline: "Researcher in human-centered artificial intelligence",
    location: "Bangkok, Thailand",
    name: "Dr. Maya Chen",
  },
  socialLinks: [
    { href: "https://github.com/", label: "GitHub" },
    { href: "https://www.linkedin.com/", label: "LinkedIn" },
    { href: "https://orcid.org/", label: "ORCID" },
  ],
};
