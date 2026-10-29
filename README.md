# TraffiCorp: website redesign

A new homepage, quote flow, and About, Careers and Contact pages for TraffiCorp, a traffic control company working across Idaho and Washington. Built as a reusable component system.

> **Preview only.** The site ships with `noindex, nofollow`. The founding year (1999), the About timeline, FAQ answers and client logos need confirming with TraffiCorp before launch. See [Open questions](#open-questions).

## The idea

TraffiCorp's buyer is a project manager who needs a compliant work zone staffed by tomorrow. The homepage lands three things for that person, in order: **safety and reliability**, **full service** (people, equipment, tech, plans), and **regional coverage at scale**, with a quote path that's never more than one click away. Recruiting moves off the buyer homepage onto its own Careers page.

The visual language comes from the work itself:

- **Sign legend.** TraffiCorp's amber (`#F79521`, from the logo) is used the way a work-zone sign uses it: as a field carrying black type. The key phrase of a heading sits on an amber band (the *sign mark*), and buttons are a label panel plus a black arrow plate.
- **Plan sheet.** Illustrations are drawn in plan view as on a traffic control plan, with cones, signs and their MUTCD codes, spacing dimensions and a title block. The coverage map uses the same language: a graticule, dimension lines and mono labels.
- **Warning lamp.** Section eyebrows carry a barricade lamp (amber lens, dark bezel, soft halo) that pulses twice when it scrolls into view and then stays lit.
- **Message board.** The loading screen and the footer band are portable changeable message signs: an amber dot matrix stepping text one column at a time, with a 5×7 dot font drawn for the project.

### The Line

One amber road line runs through the site and carries the story:

| Where | What it does | File |
|---|---|---|
| Our answer | Draws a TA-10 flagging operation (one lane, two-way) as its centreline; cars move and the two flaggers' STOP/SLOW paddles turn as pure functions of scroll (`trafficAt`, `paddlesAt` in `WorkZoneDiagram.tsx`), so motion is scrubbed and reduced motion shows a single frame | `components/sections/Solution.tsx`, `components/art/WorkZoneDiagram.tsx`, `components/art/Paddle.tsx` |
| How it works | One lane dash per step fills in the indicator as the pinned steps slide past | `components/sections/Process.tsx` |
| Coverage | The service area grows out of both hubs as the map scrolls in; each lookup drops a pin and a dimension line measures from the nearest hub | `components/sections/Coverage.tsx`, `lib/geo.ts`, `lib/mapData.ts` |
| Memberships | Painted from the truck's tail as it drives off, with the logos rising behind it | `components/sections/LogoDrive.tsx` |
| Quote / Apply sign | The sign's black inset border draws itself as it rises into view; then the form fades in | `components/quote/QuoteCard.tsx` |
| About · Careers | Draws down the "mile markers" timeline; climbs the career ladder | `Milestones.tsx`, `CareerLadder.tsx` |

In the plan drawing, every line is synced to scroll *height* rather than path percentage, so the curved centreline and the road edges reach the same point at the same moment. The coverage map is drawn in projected map units (equirectangular at 45.5°N, 100 units per degree), so hub rings are true-scale miles, and the place labels are HTML positioned as a share of the map frame, so type stays crisp at any size.

## Pages

| Route | Sections |
|---|---|
| `/` | Hero · About (with counters) · The problem · Our answer · How it works · Coverage lookup · Smart tech · Why TraffiCorp · Start where you are · Memberships · FAQ · Quick quote footer |
| `/about` | Page hero · figures · mission statement · mile-marker timeline · crew rules as regulatory signs · crew roles · memberships |
| `/careers` | Hero with NOW HIRING sign · pay figures · career ladder · benefits · a day on the crew · requirements self-check · classes · crew FAQ · Apply footer |
| `/contact` | Dispatch hero with a live office-hours indicator · call / quote / email · message form · offices with locator maps · FAQ |

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **Tailwind CSS 4**
- **GSAP 3.15** with ScrollTrigger, SplitText and DrawSVG, via `@gsap/react` (`useGSAP`)
- **Lenis** smooth scroll, driven by `gsap.ticker` and synced to ScrollTrigger
- `next/font` (Inter Tight, JetBrains Mono), `next/image`, server actions for the forms, `next/og` for the share image

## Design system

**Fluid sizing.** The root font size scales with the viewport: `1rem = 10px` at the 1728px desktop design width (`100vw / 172.8`), with separate scales for tablet and mobile (`10px` at 375px). Tailwind's spacing step is `0.1rem`, so `px-60` means 60px at design size. Small text has pixel floors (`max(1.6rem, 15px)` and so on), so it never drops below a readable size on 1280–1440px laptops and still grows with browser zoom. Tokens live in `app/globals.css`.

| Token | Value |
|---|---|
| Amber (brand) / hover | `#F79521` / `#FFAB47` |
| Ink / body / label | `#151515` / `#4B4B4B` / `#6B6B6B` |
| Asphalt / night / tile | `#111112` / `#040608` / `#212121` |
| Concrete / paper | `#EAEEF0` / `#F5F5F5` |
| Error | `#B42318` |
| Type scale (rem) | h1 10.4 · h2 8.4 · h3 7.2 · h4 6 · h5 3.6 · h6 3.2 · body 1.6–1.8 |
| Grid | 16 columns, 20px gutters, 60px side padding, 1920px max |

**Colour rule:** amber is a surface. On light backgrounds it always carries ink (8.0:1); it's never text on white (2.3:1). On asphalt and night, amber text is fine (8:1+).

## Component library

Every section is a component fed from `content/*.ts`, so new pages are assembled rather than designed from scratch.

| Component | Purpose |
|---|---|
| `Preloader` | Message-board loader: the board alone on a night field, stage words + % in amber dots, then ROAD OPEN; the screen parts down the middle. Full on `/`, short cut elsewhere |
| `Header` | Expanded / collapsed states; the logo morphs from the full wordmark into the round flagger badge (rules retract, lettering folds back, the flagger holds its x and settles while the circle grows); live dispatch indicator; current-page state; theme follows `data-header` |
| `Hero` | Photo, headline with sign mark, CTAs, ruled trust bar |
| `PageHero`, `CareersHero`, `ContactHero` | Inner-page openers |
| `SplitIntro` + `StatGrid` | Label, heading, counters and copy |
| `StaggerCards` | Heading ending in "…" with zigzag photo cards |
| `Solution` → `MergeTaper`, `LineSegment`, `PinnedDiagram` | The Line, vertical; plan drawing with features at the heights they describe |
| `Process` | Pinned horizontal steps; a compact indicator opposite the heading (step number, name, one lane dash per step that fills). Each step has a stop (first aligned with the heading, last centred). Reduced motion shows a grid |
| `Coverage` | Regional map with the two hubs and one service-area shape (solid wash of the union of 200 mile circles, clipped to land, dashed union edge via per-hub masks). Town/ZIP combobox over `content/coverage-places.json` (lazy dynamic import; ZIP prefix or town prefix/contains, largest towns first, `Town, ST` narrows by state) plus Canadian/Mexican places for an "outside the U.S." answer; quick picks from `seed`; up to five earlier lookups stay as dots; nearest hub, distance and a pre-filled quote |
| `Tech` → `OverlapCard`, `DeviceList` (default) / `TileGrid` (`layout="bento"`) | Amber opener card over a dimmed `LightField`. `DeviceList`: 11 devices grouped by purpose (Control / Warn / Protect / Monitor) as rows beside a sticky preview (≥1200px); hover, focus or scrolling a row past mid-screen (pointer off the list) swaps the preview, which crossfades stacked layers so it never dips to black; rows open the quote form; phones get per-row thumbnails. `TileGrid`: the 5×4 bento with filter chips, kept for comparison. Media use a selective-colour grade; the video plays only while shown and on screen, has a pause control and stays still under reduced motion |
| `FeatureCards` | "Why TraffiCorp": heading + proof rows led by oversized figures that count up (flush right, amber lane dash), sticky crew photo with a certification-logo plate |
| `EntryPaths` | Three ways in, each opening a pre-filled quote. Tiers build on each other (3 / 4 / 5 points, `plus` lead-in) and the desktop cards are bottom-aligned (`lg:items-end`), so the lists step them up. Icons from `tierIcons` (Icons.tsx) with hover gestures behind `motion-safe:`. `components/art/JobScale.tsx` (plan drawings for these cards) is kept but unused |
| `Milestones`, `RuleSigns`, `RoleList`, `Statement` | About-page sections |
| `CareerLadder`, `InfoGrid`, `ShiftTimeline`, `Checklist`, `PriceTags` | Careers-page sections. Ladder rungs use `roleIcons` (hover gestures behind `motion-safe:`) and the top rung is dark; benefits use `benefitIcons` |
| `Channels`, `ContactForm`, `Offices` (+ `RegionMap`) | Contact-page sections |
| `LogoDrive` | Homepage memberships: dark, sticky on desktop; the truck (`components/art/Truck.tsx`) drives off left, paints The Line from its tail and each logo rises once the tail has passed. Rims turn by the distance driven |
| `LogoGrid` | About page: a still, hairline-ruled grid of membership logos (3 across on phones, 6 on desktop), sized with `lib/logos.ts` optical boxes |
| `Faq` → `Accordion` | Keyboard-operable accordion |
| `QuoteCard`, `ApplyCard` (`SignCard`) | Finale forms on a flat amber road-sign blank: octagon-clipped corners, black inset border drawn on entry, square post |
| `QuoteForm` + `QuoteModal` | Three-step "Build your work zone" form, live work order, dispatch-ticket success |
| `Footer`, `DotMatrixMarquee` | Finale over a night photo (pitch left, sign right), the message-board band, then a black footer: brand + dispatch details, sitemap, social, offices, and placeholder legal links. All dot-matrix surfaces draw the same LED from `lib/led.ts`; every link arrow is the same horizontal `ArrowRight` as the button plates |
| UI primitives | `Button`, `SectionLabel` + `Lamp`, `LightField` (LED board that switches on around the pointer in a ripple and pops off again; unlit LEDs are a CSS pattern, lit ones a canvas; edge-faded; idle when dark), `Mark` (single-word marks render inline-block so SplitText can't strand an amber sliver on the previous line), `PlusTile` (the amber "+" on figures), `Reveal`, `RevealText`, `ParallaxImage`, `StatGrid`, `MotionToggle`, `Container`/`Grid` |
| Line art | `components/art/Devices.tsx`, `WorkZoneDiagram.tsx`, `RegionMap.tsx`, `Icons.tsx` |

## Forms

`QuoteForm` is shared by the modal (opened from every CTA). The Smart tech devices, the "Start where you are" paths and the quick-quote card all open it pre-filled. The contact page has its own message form. Both submit to **mocked server actions** (`app/actions/quote.ts`, `app/actions/contact.ts`) that validate and return a reference but don't send anything yet. Connect Resend, Formspree or TraffiCorp's dispatch/CRM there before launch.

## Accessibility

Target: WCAG 2.2 AA.

- **Audit:** axe-core 4.10 (WCAG 2.0/2.1/2.2 A + AA and best practice) reports **0 violations** on all four pages. Axe can't judge text over photos and gradients, so those were measured by sampling the rendered pixels behind each element: the worst 5% of the background still gives ≥ 4.5:1 for body text and ≥ 3:1 for large text. A dark band behind the header over the hero photo fixed the two cases that failed.
- **Keyboard:** skip link; visible focus rings (ink on light, white on dark); hidden nav and menu controls are removed from the tab order; menu and quote dialog trap focus, close on Escape and return focus. Tech tiles, chips and checklist items are real buttons, checkboxes and radios.
- **Screen readers:** one `h1` per page; landmarks; labelled fields with errors linked through `aria-describedby`; live regions for form status and the requirements checklist; counters expose the final figure; animated text stays in the accessibility tree (opacity-only fades, no `visibility: hidden` on content); external links say they open a new tab.
- **Coverage lookup:** the town search is an ARIA combobox (arrow keys, Enter, Escape) with a live region that reads out the result. The map itself is decorative; everything it shows is in the search and the result card.
- **Motion:** `gsap.matchMedia()` everywhere. Desktop gets the full choreography; mobile has no pinning; `prefers-reduced-motion` skips the loader and smooth scroll and renders every drawing complete and every line of text immediately. Continuous motion (logo rows, message board) has pause controls; lamps, pings, eyebrow lamps and the scroll hint all stop within five seconds; flashes stay well under three per second.

## Performance

All routes prerender as static. Images go through `next/image` (AVIF/WebP), and the hero image is preloaded. The message board and loader are canvas, and the board stops drawing when off screen. Map outlines are pre-projected and simplified at build time (about 20 KB).

## Assets

- **TraffiCorp's own:** logo (white, plus a dark version derived from it, split into rules and lettering layers for the header morph), the round flagger badge from the old site, truck (cut out from the map composite on the current site; its wheels rebuilt as tyre and rim layers so they can turn), membership logos (trimmed to their artwork).
- **Careers content:** pay, requirements, class prices and crew FAQ from TraffiCorp's current site.
- **Temporary photos:** Unsplash, free for commercial use under the Unsplash License. Swap for TraffiCorp field photography.
- **Temporary video:** `public/media/tech-barricades-tone.mp4`, Pexels video 28872834 (free for commercial use, Pexels License), cropped square, re-encoded (≈0.65 MB). Swap for footage of TraffiCorp's own AFADs.
- **Coverage lookup data:** `content/coverage-places.json` lists every town and ZIP in WA, ID, OR and MT (1,812 towns, 1,921 ZIPs; ~48 KB gzipped, loaded only when the coverage section is near). Built from GeoNames `cities500` and the US postal-code file with `scripts/build-coverage-places.py`. GeoNames data is **CC BY 4.0**: credit "Town and ZIP data © GeoNames" on a public page before launch.
- **Selective-colour grade:** Smart tech media (`*-tone.jpg/mp4`) are graded so only lit device elements keep their colour. Sources: Unsplash 1725770829896 (message board), 1779138398880 (signal), 1650041469312 (sign), 1602607771743 (truck), 1762953007649 (cameras), 1780293470554 (radar speed sign), 1764745223573 (sidewalk detour), 1611147533125 (traffic queue), 1750601407559 (arrow lights), 1760278395522 (night work zone).
- **Map data:** state outlines from `us-atlas` (US Census Bureau cartographic boundaries, public domain), simplified into `lib/mapData.ts`.
- **Line art, icons and the dot-matrix font:** drawn for this project.

## Open questions

- [ ] Founding year: 1999 (TraffiCorp's site) vs 2004 (BBB record). Set once in `site.founded`.
- [ ] About timeline: only 1999 and today's figures are known; the decade milestones are drafts.
- [ ] Field photos and video (Instagram, Facebook, or direct), and team photos for About.
- [ ] Client logos, testimonials and safety stats. Labelled placeholders are in place.
- [ ] Coverage lookup: the 60 / 200 mile bands, their wording, and whether to show towns in Oregon and Montana. Distances are straight-line from approximate town centres.
- [ ] Privacy policy and Terms & conditions pages (footer links point to `#` for now; set them in `content/footer.ts`).
- [ ] Smart tech: confirm truck-mounted attenuators, arrow boards, radar speed feedback and intrusion alarms (marked `confirm: true` in `content/home.ts`); they come from competitors' line-ups, not TraffiCorp's site.
- [ ] Homepage FAQ answers (drafts written from public information).
- [ ] After-hours dispatch policy; confirm `sales@trafficorp.us` is the right inbox for the site.
- [ ] Class prices and pay rates (re-confirm each season).

## What I'd do next

- A half-day field shoot: crews, devices, setups at dawn, drone footage for the hero.
- Location pages (Spokane, Boise, Coeur d'Alene) and service detail pages, assembled from these components. The coverage map's projection and corridor data are ready to reuse.
- Real testimonials, client logos and safety stats.
- Connect the quote and contact flows to CRM/dispatch, with SMS confirmation and analytics events on each step.
- Online class booking for the training schedule.
- CMS for projects, jobs and the blog.
- A redirect map from the old URLs, and a Search Console check and cleanup of the spam-indexed URLs.

## Time log

Build time only:

| Block | Time |
|---|---|
| Setup, tokens, wiring | |
| Primitives, header, loader | |
| Homepage sections | |
| The Line (solution, process, coverage) | |
| Quote form + modal | |
| About, Careers, Contact | |
| Accessibility, mobile, reduced motion, QA | |
| README + Loom | |

## Scripts

```bash
npm run dev        # local dev server
npm run build      # production build
npm run typecheck  # TypeScript
npm run lint       # ESLint
```
