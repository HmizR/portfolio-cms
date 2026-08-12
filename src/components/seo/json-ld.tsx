import { serializeJsonLd } from "@/features/seo/metadata";

export function JsonLd({ data }: { data: object | object[] }) {
  return <script dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} type="application/ld+json" />;
}
