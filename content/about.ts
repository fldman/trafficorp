/**
 * About page content. Milestones are drafted from what TraffiCorp says about
 * itself publicly; dates beyond the founding year need confirming.
 */
import { site } from "@/lib/site";

export const aboutHero = {
  label: "About TraffiCorp",
  title: "We keep the road open while it's being rebuilt.",
  mark: "open",
  intro:
    "TraffiCorp is a traffic control company from Coeur d'Alene, Idaho. For more than two decades our crews have stood between live traffic and the people fixing the road, from a single flagger on a county road to full highway closures across Idaho and Washington.",
  /** Free placeholder (Pexels); swap for a TraffiCorp job-site photo. */
  image: {
    src: "/images/photos/about-street-crew.jpg",
    alt: "A road worker in an orange hard hat and coveralls walking past a work-zone barrier and drum while city traffic keeps moving",
    position: "50% 65%",
  },
};

export const aboutStats = [
  { value: site.founded, label: "Year founded", still: true },
  { value: 180, suffix: "+", label: "Seasonal crew" },
  { value: 200, suffix: "+", label: "Contractors a year" },
  { value: 150, suffix: "+", label: "Years of combined experience" },
] as const;

export const mission = {
  label: "Mission",
  statement:
    "We’re here to give our nation the safest, most efficient and most modern road management services in the world, and to improve the quality of travel for every community we work in, from rural roads to city streets.",
  /** Placeholder name: swap in the real person once TraffiCorp confirms who the quote is from (listed in SITE.md). */
  cite: { name: "John Doe", title: "Managing Director" },
};

/** Draft timeline. Only the founding year and current figures come from TraffiCorp's site; confirm the rest. */

/** Drafted from public information; dates to be confirmed with TraffiCorp (listed in SITE.md). */
export const milestones = [
  {
    year: String(site.founded),
    title: "Flagging in North Idaho",
    text: "TraffiCorp starts out putting flaggers on local contractors' jobs.",
    image: { src: "/images/photos/about-flagger-stop.jpg", alt: "Flagger holding a STOP paddle beside a road grader" },
  },
  {
    year: "2000s",
    title: "Across the state line",
    text: "Crews start working Spokane and Eastern Washington, and the company becomes certified with Washington's OMWBE.",
    image: { src: "/images/photos/problem-understaffed.jpg", alt: "A flagger and a work truck at a lane closure on a rural highway" },
  },
  {
    year: "2010s",
    title: "Our own sign shop and plans",
    text: "Sign making and traffic control plan drafting move in-house, so a contractor's plan, signs and crew come from one place.",
    image: { src: "/images/photos/problem-compliance.jpg", alt: "Road signs and barricades lined up on a street" },
  },
  {
    year: "2020s",
    title: "Smart work-zone tech",
    text: "Automated flagger devices, portable signals and real-time traffic systems keep more crew members out of live lanes.",
    image: { src: "/images/photos/tech-message-signs.jpg", alt: "Overhead digital road signs above a highway" },
  },
  {
    year: "Today",
    title: "Two hubs, north and south",
    text: "Coeur d'Alene runs dispatch, the sign shop and training classes. A base in Nampa keeps crews and equipment close to jobs in southern Idaho.",
    image: { src: "/images/photos/about-crew-aerial.jpg", alt: "Seven construction workers in hi-vis vests standing on a site, seen from above" },
    invite: { text: "Want to be part of what comes next?", label: "Join the crew", href: site.careersHref },
  },
];

/** The crew, the rules they work by and the memberships, in one section. The photo is TraffiCorp's own; `board` is each rule as the message sign shows it (up to nine characters a line). */
export const crew = {
  label: "The crew",
  title: "The people behind the paddle.",
  text: "Flaggers, crew leads, traffic control supervisors, drivers, sign makers and the dispatchers who plan the week. Different jobs, one way of working.",
  image: {
    src: "/images/brand/team.jpg",
    alt: "Eleven members of the TraffiCorp team in company polo shirts, standing and kneeling in front of two TraffiCorp pickup trucks",
  },
  rules: {
    title: "Four rules on every job",
    items: [
      { title: "Safety comes first", board: ["SAFETY", "COMES", "FIRST"], text: "No schedule is worth a person. Every crew member can stop the work if a zone isn't safe." },
      { title: "Show up on time", board: ["SHOW UP", "ON TIME"], text: "When we say the crew starts at 6 a.m., the cones are out at 5:45." },
      { title: "One number to call", board: ["ONE", "NUMBER", "TO CALL"], text: "From the plan to the last cone, the same team answers the phone and runs the job." },
      { title: "Leave it better", board: ["LEAVE IT", "BETTER"], text: "We work where we live. Every job should leave the road and the town better than we found them." },
    ],
  },
  membersTitle: "Members of and certified by",
};

/** The closing quote card, picking up the page's story (the crew, their rules, the mile markers). */
export const aboutQuote = {
  label: "Work with us",
  title: "Your job is the next mile marker.",
  text: "The same crews and the same four rules, on your road. Tell us what, where and when, and dispatch will call you back to confirm.",
  submit: "Request a crew",
};
