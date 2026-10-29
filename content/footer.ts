/** Footer and finale copy, shared by every page. */
import { site } from "@/lib/site";

export const footer = {
  finale: {
    /** Unsplash License placeholder: barricades with amber warning lamps. */
    image: "/images/photos/cta-barricade-lamps.jpg",
    quote: { label: "Quick quote" },
    apply: {
      label: "Join the crew",
      title: "Start this season.",
      text: "No experience needed. We train you, certify you for free and pay weekly, starting at $18 an hour.",
    },
  },
  tagline: `Traffic control for road work across Idaho and Washington since ${site.founded}.`,
  /** Placeholders until TraffiCorp supplies the policy pages. */
  legal: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms & conditions", href: "#" },
  ],
} as const;
