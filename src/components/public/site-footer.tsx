interface SiteFooterProps {
  ownerName: string;
}

export function SiteFooter({ ownerName }: SiteFooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white/45">
      <div className="mx-auto flex w-full max-w-[var(--public-max-width)] flex-col gap-2 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <p>© 2026 {ownerName}</p>
        <p>Built with PortfolioCMS.</p>
      </div>
    </footer>
  );
}
