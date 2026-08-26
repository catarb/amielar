export const EXPERIENCES = [
  { slug: "aire-de-colmena", label: "Aire de Colmena" },
  { slug: "amanecer", label: "Amanecer" },
  { slug: "aire-de-colmena-ninos", label: "Aire de Colmena para niños" },
] as const;

export type ExperienceSlug = (typeof EXPERIENCES)[number]["slug"];
export const EXPERIENCE_SLUGS = [EXPERIENCES[0].slug, EXPERIENCES[1].slug, EXPERIENCES[2].slug] as const;

export function isExperienceSlug(value: string): value is ExperienceSlug {
  return (EXPERIENCE_SLUGS as readonly string[]).includes(value);
}

export function getExperienceLabel(slug: string): string {
  return EXPERIENCES.find((experience) => experience.slug === slug)?.label ?? slug;
}
