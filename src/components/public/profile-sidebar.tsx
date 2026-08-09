import { ExternalLink, Mail, MapPin } from "lucide-react";
import Image from "next/image";

import type { PublicSiteData } from "@/features/profile/queries";
import { cn } from "@/lib/utils";

interface ProfileSidebarProps {
  imageShape: PublicSiteData["appearance"]["profileImageShape"];
  owner: PublicSiteData["owner"];
  socialLinks: PublicSiteData["socialLinks"];
}

const imageShapeClasses = { circle: "rounded-full", rounded: "rounded-2xl", square: "rounded-none" } as const;

export function ProfileSidebar({ imageShape, owner, socialLinks }: ProfileSidebarProps) {
  return (
    <aside aria-labelledby="profile-name" className="md:sticky md:top-24 md:self-start">
      <div className="grid grid-cols-[5.5rem_1fr] gap-5 sm:grid-cols-[7rem_1fr] md:block">
        <Image
          alt={`Profile image for ${owner.name}`}
          className={cn("aspect-square size-22 border border-slate-200 object-cover sm:size-28 md:size-44", imageShapeClasses[imageShape])}
          height={240}
          priority
          src={owner.avatarUrl ?? "/avatar-placeholder.svg"}
          unoptimized
          width={240}
        />

        <div className="min-w-0 md:mt-6">
          <h2 id="profile-name" className="font-serif text-xl font-semibold text-slate-900">
            {owner.name}
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">{owner.headline}</p>

          <dl className="mt-3 space-y-2 text-sm text-slate-600 md:mt-5">
            {owner.location ? <div className="flex items-start gap-2">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.7} />
              <dt className="sr-only">Location</dt>
              <dd>{owner.location}</dd>
            </div> : null}
            {owner.email ? <div className="flex min-w-0 items-start gap-2">
              <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.7} />
              <dt className="sr-only">Email</dt>
              <dd className="min-w-0">
                <a
                  className="break-all underline decoration-slate-300 underline-offset-4 hover:text-[var(--public-accent)] hover:decoration-current"
                    href={`mailto:${owner.email}`}
                >
                  {owner.email}
                </a>
              </dd>
            </div> : null}
          </dl>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-600 md:mt-6">{owner.biography}</p>

      <ul aria-label="Social profiles" className="mt-5 flex flex-wrap gap-x-4 gap-y-2 md:block md:space-y-2">
        {socialLinks.map((link) => (
          <li key={link.href}>
            <a
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--public-accent)] underline decoration-current/25 underline-offset-4 hover:decoration-current"
              href={link.href}
              rel="noreferrer"
              target="_blank"
            >
              {link.label}
              <ExternalLink aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
