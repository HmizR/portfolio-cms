export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6 py-16">
      <section aria-labelledby="foundation-heading" className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          PortfolioCMS
        </p>
        <h1 id="foundation-heading" className="text-3xl font-semibold tracking-tight">
          Foundation ready
        </h1>
        <p className="max-w-prose leading-7 text-muted-foreground">
          The application foundation is running. Public portfolio features begin in the next
          milestone.
        </p>
      </section>
    </main>
  );
}
