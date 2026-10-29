/**
 * Company facts used across the site. Change them here once.
 *
 * To verify with the client before launch:
 * - Founding year: 1999 is what TraffiCorp's own site says; the BBB record says 2004.
 * - Dispatch hours beyond office hours.
 * - Class prices (taken from the current site).
 */
export const site = {
  name: "TraffiCorp",
  tagline: "Traffic management professionals",
  founded: 1999,
  phone: {
    display: "(208) 665-4683",
    href: "tel:+12086654683",
  },
  email: "sales@trafficorp.us",
  hours: "Mon–Fri, 8:00–18:00 PT",
  /** Office hours used by the live dispatch indicator (Pacific time). */
  openHours: { days: [1, 2, 3, 4, 5], from: 8, to: 18, timeZone: "America/Los_Angeles" },
  offices: [
    {
      name: "Coeur d'Alene HQ",
      lines: ["5077 N Building Center Dr", "Coeur d'Alene, ID 83815"],
      directions: "https://www.google.com/maps/dir/?api=1&destination=5077+N+Building+Center+Dr,+Coeur+d%27Alene,+ID+83815",
      note: "Headquarters, dispatch, sign shop and training classes",
      lon: -116.7805,
      lat: 47.6777,
    },
    {
      name: "Boise-area base",
      lines: ["118 N Broadmore Way", "Nampa, Idaho"],
      directions: "https://www.google.com/maps/dir/?api=1&destination=118+N+Broadmore+Way,+Nampa,+ID",
      note: "Crews and equipment for southern Idaho",
      lon: -116.5635,
      lat: 43.5407,
    },
  ],
  social: [
    { label: "Facebook", href: "https://facebook.com/trafficorp" },
    { label: "Instagram", href: "https://instagram.com/trafficorp" },
  ],
  applyHref: "https://trafficorp.bamboohr.com/careers",
  careersHref: "/careers",
} as const;

export const nav = [
  { label: "Services", href: "/#services" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;
