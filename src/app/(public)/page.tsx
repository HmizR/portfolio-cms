import { PublicShell } from "@/components/public/public-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { HomepagePresentation } from "@/features/homepage/homepage-presentation";
import { getPublicHomepageData } from "@/features/homepage/queries";
import { getPublicNavigation } from "@/features/navigation/queries";
import { getPublicSiteData } from "@/features/profile/queries";
import { personJsonLd, websiteJsonLd } from "@/features/seo/metadata";
import { getGlobalSeoSettings } from "@/features/seo/queries";

export default async function Home() {
  const [homepage, navigation, site, seo] = await Promise.all([getPublicHomepageData(), getPublicNavigation(), getPublicSiteData(), getGlobalSeoSettings()]);
  return <PublicShell navigation={navigation} site={site}><JsonLd data={[websiteJsonLd(seo), personJsonLd(seo, { name: site.owner.name, description: site.owner.biography, image: site.owner.avatarUrl, sameAs: site.socialLinks.map((link) => link.href) })]} /><HomepagePresentation data={homepage} /></PublicShell>;
}
