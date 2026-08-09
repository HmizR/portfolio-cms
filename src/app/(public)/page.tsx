import { PublicShell } from "@/components/public/public-shell";
import { getPublicNavigation } from "@/features/navigation/queries";
import { getPublicSiteData } from "@/features/profile/queries";

const researchDirections = [
  {
    title: "Human oversight in AI-assisted decisions",
    description:
      "Designing explanations and review workflows that help people question a model rather than simply defer to it.",
  },
  {
    title: "Learning with generative systems",
    description:
      "Studying when conversational tools deepen understanding—and when they create an illusion of fluency.",
  },
  {
    title: "Public-interest technology",
    description:
      "Translating responsible AI principles into practical methods for educators and civic institutions.",
  },
];

export default async function Home() {
  const [navigation, site] = await Promise.all([getPublicNavigation(), getPublicSiteData()]);
  return (
    <PublicShell navigation={navigation} site={site}>
      <article>
      <header className="border-b border-slate-200 pb-9 sm:pb-11">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--public-accent)]">
          Academic portfolio
        </p>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-[1.12] tracking-[-0.025em] text-slate-950 sm:text-5xl">
          Studying how people learn with intelligent systems.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          I am a researcher and educator working across human-computer interaction, learning
          sciences, and responsible artificial intelligence.
        </p>
      </header>

      <section id="about" className="scroll-mt-24 border-b border-slate-200 py-9 sm:py-11">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-slate-900">About</h2>
        <div className="mt-5 space-y-5 text-[1.02rem] leading-8 text-slate-700">
          <p>
            My work asks a simple question: how can computational systems extend human judgment
            without quietly replacing it? I combine qualitative research, experiments, and
            participatory design to understand how people make sense of AI-supported decisions.
          </p>
          <p>
            I currently focus on tools used in education and public-serving institutions, where
            clarity, agency, and accountability matter as much as model performance.
          </p>
        </div>
      </section>

      <section id="research" className="scroll-mt-24 border-b border-slate-200 py-9 sm:py-11">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-slate-900">
            Research directions
          </h2>
          <p className="text-sm text-slate-500">Current and developing work</p>
        </div>
        <ol className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
          {researchDirections.map((direction, index) => (
            <li className="grid gap-2 py-5 sm:grid-cols-[2rem_1fr] sm:gap-3" key={direction.title}>
              <span aria-hidden="true" className="font-serif text-sm text-[var(--public-accent)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">{direction.title}</h3>
                <p className="mt-1.5 leading-7 text-slate-600">{direction.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="writing" className="scroll-mt-24 border-b border-slate-200 py-9 sm:py-11">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-slate-900">
          Writing &amp; teaching
        </h2>
        <p className="mt-5 text-[1.02rem] leading-8 text-slate-700">
          I write for academic and practitioner audiences about responsible system design,
          evaluation, and the everyday work of making automated decisions understandable. My
          teaching centers on research methods, interaction design, and critical data literacy.
        </p>
      </section>

      <section id="cv" className="scroll-mt-24 pt-9 sm:pt-11">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-slate-900">
          Curriculum vitae
        </h2>
        <p className="mt-5 text-[1.02rem] leading-8 text-slate-700">
          A structured, printable CV will be published in a later milestone. For collaborations,
          invited talks, or student supervision, please get in touch by email.
        </p>
      </section>
      </article>
    </PublicShell>
  );
}
