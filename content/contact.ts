/** Contact page content. */
import { site } from "@/lib/site";

export const contactHero = {
  label: "Contact",
  title: "Talk to dispatch.",
  intro: "For crews, plans, equipment and emergencies, the fastest way in is a phone call. For quotes and paperwork, pick the line that fits.",
  image: { src: "/images/photos/contact-light.jpg", alt: "An amber construction warning light glowing at night" },
};

export const channels = [
  {
    icon: "call",
    title: "Call dispatch",
    value: site.phone.display,
    href: site.phone.href,
    text: `${site.hours}. After hours, call the same number for emergency and storm response.`,
  },
  {
    icon: "quote",
    title: "Build your work zone",
    value: "Get a quote",
    href: "#quote",
    text: "Three quick steps. Dispatch calls you back to confirm crew, devices and timing.",
  },
  {
    icon: "email",
    title: "Write to us",
    value: site.email,
    href: `mailto:${site.email}`,
    text: "Plans, drawings, invoices and anything that needs a paper trail.",
  },
] as const;

/** Wording for the coverage map on this page; the map data and results come from the homepage's `coverage`. */
export const contactCoverage = {
  label: "Our hubs",
  title: "Which hub is",
  mark: "closest to you?",
  intro: "Headquarters in Coeur d'Alene runs dispatch, the sign shop and training; our base in Nampa, next to Boise, serves southern Idaho. Find your town or ZIP to see which one would send your crew.",
};
