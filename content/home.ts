/**
 * Homepage content. Every section component reads from here, so copy can be
 * edited without touching layout code.
 *
 * Photos in /public/images/photos are royalty-free placeholders (Unsplash
 * License) until TraffiCorp supplies field photography.
 */
import { site } from "@/lib/site";

export const hero = {
  title: ["We don't go", "with the flow.", "We control it."],
  // Non-breaking hyphen and space keep "work-zone" and "Coeur d'Alene" on one line.
  subline: `Flaggers, pilot cars, signals, message boards and full work‑zone setups across Idaho and Washington, from Coeur d'Alene and Spokane to Boise. Staffed on time since ${site.founded}.`,
  image: {
    src: "/images/photos/hero-interchange.jpg",
    alt: "Aerial view of a highway interchange at dusk",
  },
  logosLabel: "Certified & trusted",
};

/** Membership marks, trimmed to their artwork. `weight` evens out how heavy each one reads (see lib/logos.ts). */
export const members = [
  { name: "ATSSA", src: "/images/members/atssa-knockout.png", w: 227, h: 117, weight: 0.9 },
  { name: "DBE certified", src: "/images/members/dbe.png", w: 250, h: 250, weight: 0.98 },
  { name: "Washington OMWBE", src: "/images/members/omwbe.png", w: 248, h: 88, weight: 1.15 },
  { name: "NFIB", src: "/images/members/nfib-knockout.png", w: 232, h: 82, weight: 0.95 },
  { name: "Equal Opportunity Employer", src: "/images/members/eeo.png", w: 249, h: 105, weight: 1.11 },
  { name: "Idaho Public Works", src: "/images/members/publicworks.png", w: 248, h: 166, weight: 1.14 },
] as const;

/** Figures from TraffiCorp's current website. */
export const stats = [
  { value: 180, suffix: "+", label: "Seasonal crew" },
  { value: 200, suffix: "+", label: "Contractors a year" },
  { value: 150, suffix: "+", label: "Years of combined experience" },
  { value: 4, suffix: "", label: "States our flagger cards cover" },
] as const;

export const about = {
  label: "About",
  title: `Since ${site.founded}, the crew the Pacific Northwest trusts with its`,
  mark: "work zones.",
  lead: "If you've ever driven through a work zone in the Pacific Northwest, you've probably met one of our flaggers.",
  body: [
    "TraffiCorp is a traffic control company based in Coeur d'Alene, Idaho. Construction crews build the road, lay the pipe or run the power line. We handle the traffic around them, so the job keeps moving and nobody gets hurt.",
    "Utility companies, prime contractors and state and federal project managers trust us with basic and complex work zones, from a one-day flagging job to a season-long highway closure.",
  ],
  link: { label: "More about TraffiCorp", href: "/about" },
  image: { src: "/images/photos/about-flagger-road.jpg", alt: "Flagger holding a STOP sign on a two-lane road through a pine forest" },
};

export const problem = {
  title: "Every road job needs traffic control, but too often it's…",
  items: [
    {
      title: "Understaffed on day one",
      text: "The crew is booked for 6 a.m. and the flaggers show up two people short. The paving train waits, and the delay lands on your schedule.",
      image: { src: "/images/photos/problem-understaffed.jpg", alt: "A lone flagger with a STOP sign on an open road" },
    },
    {
      title: "A compliance risk",
      text: "A sign set too close or a taper cut short won't pass MUTCD or state DOT review. One failed inspection can shut a site down for the day.",
      image: { src: "/images/photos/problem-compliance.jpg", alt: "A cluster of mismatched road signs and barricades" },
    },
    {
      title: "A safety risk",
      text: "Flaggers stand a few feet from live traffic, often at night or in bad weather. Without training and the right devices, that's where people get hurt.",
      image: { src: "/images/photos/problem-safety.jpg", alt: "Road worker in a hi-vis vest beside heavy machinery at night" },
    },
    {
      title: "Split across five vendors",
      text: "Flaggers from one company, signs from another, the message board from a third. When something goes wrong, nobody owns the plan.",
      image: { src: "/images/photos/problem-vendors.jpg", alt: "Cones, signs and a temporary signal of different types on a mountain road" },
    },
    {
      title: "Slow when things go wrong",
      text: "A water main breaks at 2 a.m. or a storm takes out a lane. Most traffic control companies don't answer until the office opens.",
      image: { src: "/images/photos/problem-slow.jpg", alt: "ROAD CLOSED sign behind orange barriers and cones" },
    },
  ],
};

export const solution = {
  label: "Our answer",
  title: ["One crew that runs", "the"],
  accent: "entire work zone",
  statement:
    "We write the plan, make the signs, bring the devices and staff every position. One call to dispatch covers the whole job, from the first ROAD WORK AHEAD sign to the last cone picked up.",
  /** `at` is the height (in drawing units, 0–1600) where each feature sits beside the plan drawing: an even staircase on alternating sides, clear of the flagger paddles (A at 418 on the left, B at 1122 on the right). */
  features: [
    {
      title: "Smart tech",
      text: "Automated flagger devices, temporary signals and real-time traffic systems that keep crews out of live lanes.",
      side: "right",
      at: 280,
    },
    {
      title: "Equipment",
      text: "Cones, drums, barricades, pilot cars and trailer-mounted message boards, plus signs from our own sign shop. Owned, maintained and on our trucks.",
      side: "left",
      at: 570,
    },
    {
      title: "People",
      text: "Certified flaggers and traffic control supervisors, trained in-house every week. Our flagger cards are valid in Washington, Oregon, Idaho and Montana.",
      side: "right",
      at: 850,
    },
    {
      title: "Traffic control plans",
      text: "Custom plans drawn to MUTCD and state DOT standards, including ITD and WSDOT, ready for permit review.",
      side: "left",
      at: 1110,
    },
  ] as const,
};

export const process = {
  label: "How it works",
  title: "From the first call to the",
  mark: "last cone.",
  steps: [
    {
      title: "Call dispatch",
      text: "Tell us the road, the dates and the work. Dispatch tells you what we can cover before you hang up.",
      media: { kind: "ticket" as const },
    },
    {
      title: "Plan the zone",
      text: "We draw the traffic control plan to MUTCD and state DOT standards, ready for permit review.",
      media: { kind: "photo" as const, src: "/images/photos/process-plan.jpg", alt: "Two crew members in hi-vis vests reviewing plans on a tablet, seen from above" },
    },
    {
      title: "Set it up",
      text: "Our trucks bring the signs, cones, drums and boards, and the crew sets the zone in the order the plan calls for.",
      media: { kind: "photo" as const, src: "/images/photos/process-setup.jpg", alt: "Worker in an orange vest beside a work truck and traffic cones" },
    },
    {
      title: "Run it safely",
      text: "Certified flaggers, pilot cars and automated devices keep traffic moving and keep crews out of live lanes.",
      media: { kind: "photo" as const, src: "/images/photos/process-run.jpg", alt: "Lit amber chevron boards guiding traffic on a highway at night" },
    },
    {
      title: "Clear the road",
      text: "When the work is done we pick up every device and reopen the lanes. Nothing left on the shoulder.",
      media: { kind: "photo" as const, src: "/images/photos/process-clear.jpg", alt: "An empty, reopened two-lane road with fresh double yellow lines" },
    },
  ],
};

/**
 * Coverage map. Town positions are approximate (city centres). Distances are
 * worked out on the page as straight-line miles to the nearest hub, and the
 * 60 / 200 mile bands are a draft to confirm with TraffiCorp.
 */
export const coverage = {
  label: "Coverage",
  title: "Is your job",
  mark: "in our area?",
  intro: "Crews and equipment run out of two hubs: our headquarters in Coeur d'Alene and our base in Nampa, next to Boise. Find your town or ZIP to see how far the nearest one is.",
  inputLabel: "Where's the job?",
  placeholder: "Town or ZIP, e.g. Post Falls",
  picksLabel: "Try",
  picks: ["Spokane", "Lewiston", "Boise", "Missoula"],
  start: "Spokane",
  rings: { near: 60, range: 200 },
  tiers: {
    near: { badge: "Near a hub", text: "Crews and equipment are based {miles} miles away in {hub}." },
    range: { badge: "In range", text: "We send crews and equipment out to you from {hub}." },
    far: { badge: "Outside our area", text: "This is outside our normal area, but reach out and we'll see what we can do to help. We plan every job individually." },
    home: "Our {hub} is right here in town.",
  },
  outOfState: "Our flagger certifications are valid in Oregon and Montana too.",
  missing: "It doesn't look like we serve that area yet. Reach out and we'll let you know what we can do for your job.",
  /** Places outside the U.S. that people nearby might type; anything else mentioning these regions counts too. */
  abroad: {
    badge: "Outside the U.S.",
    text: "Sorry, we currently don't offer our services in this area.",
    places: [
      { name: "Vancouver", region: "BC", country: "Canada" },
      { name: "Victoria", region: "BC", country: "Canada" },
      { name: "Surrey", region: "BC", country: "Canada" },
      { name: "Kelowna", region: "BC", country: "Canada" },
      { name: "Kamloops", region: "BC", country: "Canada" },
      { name: "Penticton", region: "BC", country: "Canada" },
      { name: "Nelson", region: "BC", country: "Canada" },
      { name: "Cranbrook", region: "BC", country: "Canada" },
      { name: "Trail", region: "BC", country: "Canada" },
      { name: "Calgary", region: "AB", country: "Canada" },
      { name: "Edmonton", region: "AB", country: "Canada" },
      { name: "Lethbridge", region: "AB", country: "Canada" },
      { name: "Toronto", region: "ON", country: "Canada" },
      { name: "Montreal", region: "QC", country: "Canada" },
      { name: "Mexico City", region: "CDMX", country: "Mexico" },
      { name: "Tijuana", region: "BC", country: "Mexico" },
    ],
    words: ["canada", "bc", "british columbia", "alberta", "ab", "saskatchewan", "sk", "manitoba", "mb", "ontario", "on", "quebec", "qc", "yukon", "mexico", "mx", "uk", "united kingdom", "england", "europe", "australia"],
  },
  legend: { hub: "TraffiCorp hub", area: "Our normal area, within 200 mi of a hub" },
  hubs: [
    { name: "Coeur d'Alene HQ", short: "Coeur d'Alene", lon: -116.7805, lat: 47.6777, side: "right" },
    { name: "Nampa base", short: "Nampa", lon: -116.5635, lat: 43.5407, side: "left" },
  ],
  /**
   * The "Try" towns, so the map and answer work before the full town and ZIP
   * list (content/coverage-places.json, loaded on demand) arrives.
   */
  seed: [
    { name: "Spokane", state: "WA", lon: -117.426, lat: 47.6588 },
    { name: "Lewiston", state: "ID", lon: -117.0177, lat: 46.4165 },
    { name: "Boise", state: "ID", lon: -116.2023, lat: 43.615 },
    { name: "Missoula", state: "MT", lon: -113.994, lat: 46.8721 },
  ],
  states: [
    { name: "WASHINGTON", lon: -120.6, lat: 48.35 },
    { name: "IDAHO", lon: -114.9, lat: 44.6 },
    { name: "OREGON", lon: -120.2, lat: 43.9, faint: true },
    { name: "MONTANA", lon: -112.6, lat: 47.6, faint: true },
  ],
} as const;

export const tech = {
  title: "Smart work-zone tech that keeps your crew out of traffic.",
  image: { src: "/images/photos/tech-message-signs.jpg", alt: "Overhead digital road signs showing a speed limit, a road work warning and a lane arrow" },
  /**
   * The tech, grouped by what each device does. Shown as a list with one large
   * preview (default); `media` and `preview` feed the preview and the phone
   * thumbnails. The bento layout (`layout="bento"`) uses `size` (big 2×2,
   * wide 2×1, tall 1×2, one 1×1), `at` (desktop cell [column, row] on a 5×4
   * grid) and `media` only.
   *
   * Offered per TraffiCorp's own site and blog: AFAD, message boards,
   * temporary signals, real-time traffic management with 24/7 remote
   * monitoring (Superior Traffic Services partnership), pedestrian and
   * side-road control, sign shop. `confirm: true` marks devices that are
   * standard in competitors' line-ups and still need TraffiCorp's OK.
   * Media are placeholders (Pexels / Unsplash) in a selective-colour grade:
   * lit device elements keep their colour, the rest is black and white.
   */
  filters: [
    { key: "control", label: "Control", note: "Hold and release traffic" },
    { key: "warn", label: "Warn", note: "Tell drivers what's ahead" },
    { key: "protect", label: "Protect", note: "Stand between traffic and the crew" },
    { key: "monitor", label: "Monitor", note: "Watch the zone around the clock" },
  ],
  tiles: [
    {
      title: "Automated flagger devices (AFAD)",
      icon: "afad",
      service: "AFAD",
      category: "control",
      text: "A remote-operated signal and gate arm hold and release traffic, so nobody has to stand in the lane.",
      tag: "Most requested",
      size: "big",
      at: [4, 1],
      media: { kind: "video", src: "/media/tech-barricades-tone.mp4", poster: "/media/tech-barricades-tone.jpg" },
    },
    {
      title: "Temporary traffic signals",
      icon: "signal",
      service: "Temporary signal",
      category: "control",
      text: "Portable signals for one-lane sections and intersections, day or night.",
      size: "tall",
      at: [3, 1],
      media: { kind: "image", src: "/images/photos/tech-signal-tone.jpg", position: "36% 50%" },
    },
    {
      title: "Portable message boards",
      icon: "pcms",
      service: "Message board",
      category: "warn",
      text: "Trailer-mounted boards that warn drivers well ahead, programmed for your job.",
      size: "wide",
      at: [1, 2],
      media: { kind: "image", src: "/images/photos/tech-message-board-tone.jpg", position: "38% 62%" },
    },
    {
      title: "Real-time traffic & queue warning",
      icon: "realtime",
      service: "Full setup",
      category: "warn",
      text: "Sensors spot slowing traffic and update the boards upstream, through our Superior Traffic Services partnership.",
      size: "one",
      at: [1, 3],
      preview: { kind: "image", src: "/images/photos/tech-queue-tone.jpg", position: "50% 50%" },
    },
    {
      title: "Truck-mounted attenuators",
      icon: "tma",
      service: "Equipment rental",
      category: "protect",
      text: "A crash cushion on a shadow truck that takes the hit before a crew member does.",
      size: "one",
      at: [2, 3],
      confirm: true,
      media: { kind: "image", src: "/images/photos/tech-truck-tone.jpg", position: "50% 62%" },
    },
    {
      title: "Arrow boards",
      icon: "arrowboard",
      service: "Equipment rental",
      category: "warn",
      text: "Sequenced lamp arrows that move traffic out of a closed lane long before the taper.",
      size: "one",
      at: [3, 3],
      confirm: true,
      preview: { kind: "image", src: "/images/photos/tech-arrows-tone.jpg", position: "62% 50%" },
    },
    {
      title: "Remote monitoring, 24/7",
      icon: "camera",
      service: "Full setup",
      category: "monitor",
      text: "Camera trailers and remote device checks, watched around the clock with our partner.",
      size: "one",
      at: [4, 3],
      media: { kind: "image", src: "/images/photos/tech-cameras-tone.jpg", position: "50% 70%" },
    },
    {
      title: "Radar speed feedback",
      icon: "speed",
      service: "Equipment rental",
      category: "warn",
      text: "Shows drivers their speed as they approach, and slows them before they reach the crew.",
      size: "one",
      at: [5, 3],
      confirm: true,
      preview: { kind: "image", src: "/images/photos/tech-speed-tone.jpg", position: "47% 40%" },
    },
    {
      title: "In-house sign shop",
      icon: "signshop",
      service: "Signs",
      category: "warn",
      text: "Signs made and maintained in our own shop, so the right sign shows up on time.",
      size: "one",
      at: [1, 4],
      media: { kind: "image", src: "/images/photos/tech-sign-shop-tone.jpg", position: "50% 68%" },
    },
    {
      title: "Work-zone intrusion alarms",
      icon: "alarm",
      service: "Full setup",
      category: "protect",
      text: "Sensors along the taper sound an alarm the moment a vehicle breaks into the work space.",
      size: "one",
      at: [2, 4],
      confirm: true,
      preview: { kind: "image", src: "/images/photos/tech-alarm-tone.jpg", position: "50% 62%" },
    },
    {
      title: "Pedestrian & side-road control",
      icon: "pedestrian",
      service: "Full setup",
      category: "control",
      text: "Devices and plans that keep sidewalks, driveways and side streets safe through the work.",
      size: "one",
      at: [4, 4],
      preview: { kind: "image", src: "/images/photos/tech-sidewalk-tone.jpg", position: "50% 40%" },
    },
  ],
  ctaAt: [5, 4],
  cta: "Plan your work zone",
  previewCta: "Get a quote",
} as const;

export const why = {
  label: "Why TraffiCorp",
  accent: "Trusted",
  title: `with work zones since ${site.founded}.`,
  intro: "The crew, the training and the paperwork public work needs, all kept in-house.",
  /** Unsplash License placeholder until TraffiCorp supplies a crew photo (also used on About). */
  image: { src: "/images/photos/about-crew-aerial.jpg", alt: "Seven construction workers in hi-vis vests standing on a site, seen from above" },
  /** DBE and Washington OMWBE certification, shown on the photo (helps primes meet participation goals). */
  certs: {
    names: ["DBE", "OMWBE"],
    label: "certified",
    logos: members.filter((m) => m.name === "DBE certified" || m.name === "Washington OMWBE"),
  },
  /** Each proof point leads with a figure that counts up. */
  items: [
    {
      value: 180,
      suffix: "+",
      title: "Seasonal crew",
      text: "A full roster for the summer construction season, so a two-person flagging job and a multi-crew highway closure can run the same week.",
    },
    {
      value: 4,
      title: "States our flagger cards cover",
      text: "We run flagger certification classes every week and train our own traffic control supervisors. Cards are valid in WA, OR, ID and MT.",
    },
    {
      value: 200,
      suffix: "+",
      title: "Contractors a year, federal-aid jobs included",
      text: "Prevailing-wage and Davis-Bacon jobs are routine for us, including the certified payroll that comes with them.",
    },
  ],
} as const;

export const entry = {
  label: "Start where you are",
  title: "Book one crew today. Bring us the whole season tomorrow.",
  /**
   * Each tier includes the one before it and adds more (3, 4 and 5 points), so
   * the cards build up like a staircase. Every point is something TraffiCorp
   * already states it does (see lib/site.ts and the sections above).
   */
  paths: [
    {
      tag: "1–2 days",
      icon: "day",
      title: "One crew, tomorrow",
      text: "A flagging crew or a lane closure for a day or two: utility cuts, service calls, short repairs.",
      includes: ["Certified flaggers", "Signs and cones", "Pilot car if needed"],
      cta: "Request a crew",
      prefill: { services: ["Flagging"], duration: "1 day" },
    },
    {
      tag: "Weeks",
      icon: "project",
      title: "A project this season",
      text: "Road, utility or bridge work that needs a plan, a crew and devices from the first day to the last.",
      plus: "Everything in a crew day, plus",
      includes: ["Traffic control plan", "Full setup and pick-up", "Message boards, signals and our own signs", "Traffic control supervisor on site"],
      cta: "Plan the project",
      prefill: { services: ["Traffic control plan", "Full setup"], duration: "1–4 weeks" },
    },
    {
      tag: "Every season",
      icon: "program",
      title: "A program or corridor",
      text: "Agencies and utilities with recurring work across a region. One partner and one dispatch, season after season.",
      plus: "Everything in a project, plus",
      includes: [
        "Season-long crews on one dispatch",
        "Smart work-zone tech, monitored 24/7",
        "Federal-aid, prevailing wage and certified payroll",
        "DBE and OMWBE participation",
        "Flagger cards valid in WA, OR, ID and MT",
      ],
      cta: "Talk through a program",
      prefill: { services: ["Full setup"], duration: "Full season", role: "Agency" },
    },
  ],
} as const;

export const partners = {
  label: "Memberships & certifications",
  title: "Trusted on public and private work",
  cta: "Work with us",
  truckAlt: "TraffiCorp pickup truck carrying a ROAD WORK AHEAD sign and cones",
};

/** Draft answers written from public information. Confirm with TraffiCorp. */
export const faq = {
  label: "FAQ",
  title: "Quick answers before you call dispatch",
  items: [
    {
      q: "How fast can you staff a job?",
      a: "Often the next day during construction season, depending on crew size and location. Call dispatch with your start date and we'll tell you what we can cover before you hang up.",
    },
    {
      q: "Do you write traffic control plans?",
      a: "Yes. We draw custom traffic control plans to MUTCD and state DOT standards, including ITD and WSDOT, and prepare them for permit submittal.",
    },
    {
      q: "Which areas do you cover?",
      a: "Idaho and Washington, with crews based in Coeur d'Alene and Nampa. We work across the Spokane, Coeur d'Alene and Boise areas and the roads between them.",
    },
    {
      q: "Are your flaggers certified?",
      a: "Every flagger holds a current flagger card. We run certification classes in-house every week, and the cards are valid in Washington, Oregon, Idaho and Montana.",
    },
    {
      q: "Do you work federal-aid and prevailing-wage jobs?",
      a: "Yes. We regularly staff Davis-Bacon and prevailing-wage projects and handle the certified payroll that goes with them.",
    },
    {
      q: "Can I rent equipment without a crew?",
      a: "Yes. Cones, drums, signs, message boards and other devices can be rented on their own. Ask dispatch about delivery and pick-up.",
    },
    {
      q: "Do you handle emergency and storm response?",
      a: "Yes. When a road has to close fast, call dispatch and we'll send the people and devices to make it safe.",
    },
  ],
};

export const quickQuote = {
  title: "Need a crew tomorrow?",
  text: "Tell us what, where and when. Dispatch will call you back to confirm crew and timing.",
  submit: "Request a crew",
};

export const marquee = `NEED A CREW? ▸ GET A QUOTE ▸ ${site.phone.display} ▸ `;
