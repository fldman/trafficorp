/**
 * Careers page content, from TraffiCorp's current careers, classes and FAQ
 * pages. Pay, prices and policies should be re-confirmed each season.
 */
import { site } from "@/lib/site";

export const careersHero = {
  label: "Careers",
  title: ["Hold the line.", "Build a career."],
  intro: "Join the crew that keeps Idaho and Washington's roads moving while they're rebuilt. No experience needed: we train you, certify you and pay you every week.",
  image: { src: "/images/photos/careers-crew.jpg", alt: "Road crew members in safety vests standing in front of a construction vehicle" },
  apply: site.applyHref,
  hiring: { label: "Now hiring", roles: "Flaggers & supervisors", pay: "From $18/hr · Paid weekly" },
};

export const benefits = {
  label: "What you get",
  title: "Solid wages. Solid team. Solid opportunities.",
  items: [
    { icon: "pay", title: "Paid weekly", text: "By direct deposit or check, every week of the season." },
    { icon: "cert", title: "Free certification", text: "We certify every employee for free. Classes run in-house every week." },
    { icon: "gear", title: "Gear provided", text: "Hard hat and ANSI Class III vest supplied. Loaner paddles on every project." },
    { icon: "wage", title: "Prevailing-wage work", text: "Federal-aid jobs pay up to $35/hr, with fringe benefits paid into a Davis-Bacon retirement plan." },
    { icon: "local", title: "Local work", text: "We hire locally and nobody is forced to travel. Out-of-town work usually comes with per diem." },
    { icon: "season", title: "Come back every season", text: "Flagging is seasonal. Returning crew don't need to re-apply if they've been away less than a year." },
  ],
} as const;

/** Requirements every open role shares (listed inside each role). */
export const requirements = {
  items: [
    "18 years or older",
    "Able to lift 50 lb repeatedly and walk long distances in a work zone",
    "Strong problem-solving and communication skills",
    "Able to read instructions, plans and maps of work zone locations",
    "Flexible for different shifts, including nights and some weekends",
    "Excellent attendance and dependable transportation",
    "Valid driver's license",
  ],
};

/**
 * Open positions. Crew member and traffic control supervisor match the roles
 * TraffiCorp currently advertises; pilot car driver is a draft to confirm, as
 * are locations and the role-specific requirements (listed in SITE.md).
 * Every role also lists `requirements.items`.
 */
export const roles = {
  label: "Open positions",
  title: "Looking for work? We're hiring.",
  image: {
    src: "/images/photos/careers-roadclosed.jpg",
    alt: "A road crew in hi-vis vests behind a ROAD CLOSED sign and cones, with an excavator working in the street",
    position: "50% 55%",
  },
  apply: { label: "Apply now", href: site.applyHref },
  items: [
    {
      title: "Crew member (flagger)",
      where: "North Idaho, Spokane & Boise area",
      type: "Seasonal, full-time",
      pay: "$18–35/hr",
      summary: "Every new hire starts here. You stand at the front of the work zone and keep traffic and the road crew safe from each other.",
      duties: [
        "Control traffic with a STOP/SLOW paddle and keep drivers moving",
        "Set out and pick up cones, signs and other devices in the order the plan calls for",
        "Watch out for the road crew, drivers and people on foot",
        "Check your schedule in the Deputy app and report to each job ready to work",
      ],
      extra: ["A flagger card, or get one free at our weekly in-house class"],
    },
    {
      title: "Traffic control supervisor",
      where: "Coeur d'Alene",
      type: "Full-time",
      pay: "Based on experience",
      summary: "You set up and sign off work zones, and lead crews on highway and other complex jobs.",
      duties: [
        "Set up, inspect and sign off work zones to the traffic control plan",
        "Lead flagging crews on highway and multi-day jobs",
        "Adjust signs and devices as the work moves, keeping the zone compliant",
        "Keep inspection notes and stay in touch with the contractor and dispatch",
      ],
      extra: ["Traffic control supervisor (TCS) certification, or take our TCS class", "Experience working in highway work zones"],
    },
    {
      title: "Pilot car driver",
      where: "Coeur d'Alene & Nampa",
      type: "Seasonal",
      pay: "Based on experience",
      summary: "You lead traffic through one-lane work zones in a marked pilot car, so the flaggers at each end can keep the line moving.",
      duties: [
        "Lead each queue of traffic through the work zone at a steady, safe speed",
        "Stay in radio contact with the flaggers at both ends",
        "Inspect your vehicle, signs and lights before every shift",
      ],
      extra: ["A clean driving record", "A flagger card, or get one free at our weekly in-house class"],
    },
  ],
} as const;

export const classes = {
  label: "Training & classes",
  title: "Get certified at our headquarters.",
  text: "Classes run at our Coeur d'Alene HQ, 5077 N Building Center Dr. Bring your driver's license or ID and a form of payment, and arrive 15 minutes early. We'll email you the day before.",
  /** `free` marks the class TraffiCorp employees take at no cost (the tag turns amber). */
  items: [
    { price: 100, tag: "Free for crew", free: true, title: "WSDOT flagging class", text: "Washington certification, also valid in Oregon, Idaho and Montana. Free for TraffiCorp employees." },
    { price: 595, tag: "New supervisors", title: "TCS certification", text: "For anyone who isn't yet a certified traffic control supervisor." },
    { price: 450, tag: "Renewal", title: "TCS recertification", text: "For certified supervisors who need to renew." },
  ],
  /** Booking goes through the contact page; every ticket links there too. */
  cta: { label: "Book a class", href: "/contact" },
  ticketCta: "Book this class",
};

/** From TraffiCorp's employee FAQ. */
export const careersFaq = {
  label: "Crew FAQ",
  title: "Questions new crew members ask",
  items: [
    { q: "What is a flagger card and why do I need it?", a: "The flagger certification course teaches standard flagging signals, procedures and practices. When you pass, you get a flagger card that's good for three years. TraffiCorp certifies employees for free." },
    { q: "How much will I make and how do I get paid?", a: "Flaggers start at $18 an hour, and prevailing-wage jobs can pay up to $35 an hour. You're paid weekly by direct deposit or check. Direct deposit is best." },
    { q: "What do I wear to the job?", a: "A hard hat (brim facing front), your TraffiCorp ANSI Class III vest, sturdy pants without holes and boots that cover your ankle. In cold or rainy weather, any lime ANSI Class III reflective gear is fine." },
    { q: "Where do I go and who do I check in with?", a: "Your schedule for the week is published in the Deputy app and texted to you. It tells you where to go and what you'll be doing. Check every night for last-minute changes." },
    { q: "Can I only work locally, days or nights?", a: "Yes, but the hours available to you will be limited. Enter your availability in Deputy at least seven days ahead." },
    { q: "What happens at the end of the season?", a: "Flagging is seasonal, with a short lay-off through the winter. Contact HR in late January or early February to come back. You don't need to re-apply if you've been gone less than a year." },
    { q: "What if a job doesn't feel safe?", a: "Always raise it with your supervisor first. If it isn't addressed, contact the project manager. Be specific about your concern." },
  ],
};
