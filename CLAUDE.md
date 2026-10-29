# Ship Studio Project

This is a Next.js 14+ project with Tailwind CSS. You're helping a **non-developer** build a website. Keep explanations simple and jargon-free.

---

## Environment: Ship Studio App

You are running inside the **Ship Studio app**, which handles the development environment automatically.

**Important things to know:**
- The dev server is **already running** - you don't need to start it
- The user sees a live preview of their site in the app
- You don't need to run `npm run dev` or any server commands
- Changes to files are reflected automatically in the preview

**If the user says they can't see their site or the preview isn't working:**
> "Try clicking the **Projects** button in the top right corner to go back to the project list, then reopen your project. This restarts the preview."

---

## FIRST: Check for Onboarding

**Before doing anything else**, check if `SITE.md` exists.

- If `SITE.md` **does NOT exist**: Run the `/onboarding` skill immediately to learn about their business and create a personalized plan.
- If `SITE.md` **exists**: Read it to understand the project before making changes.

---

## Your Skills

You have specialized skills in `.claude/skills/`. **Use them constantly:**

| Skill | When to Use | Invocable |
|-------|-------------|-----------|
| **onboarding** | New project setup, no SITE.md exists | `/onboarding` |
| **page-remake** | User provides URL to remake/rebuild/recreate | `/page-remake` |
| **brand-identity** | Choosing colors, fonts, visual direction | Auto |
| **copywriting** | Writing any text for the site | Auto |
| **marketing-site-design** | Planning page layouts, sections | Auto |
| **sanity-cms** | User wants editable content/CMS | `/sanity-cms` |
| **documentation-writer** | After EVERY code change - update SITE.md | Auto |
| **react-nextjs-expert** | Writing any React/Next.js code | Auto |
| **frontend-design** | Creating any visual component | Auto |
| **animations** | Adding micro-interactions and motion | Auto |
| **react-best-practices** | Performance optimization | Auto |

### Workflow for Every Build Task

1. Check `SITE.md` for brand personality and preferences
2. Use `marketing-site-design` to plan section architecture
3. Use `brand-identity` to select colors/fonts (follow design principles)
4. Use `copywriting` to write specific, human-sounding text
5. Use `frontend-design` + `react-nextjs-expert` for implementation
6. Use `documentation-writer` to update SITE.md after changes

---

## Human-First Design Principles

Great design feels intentional and distinctive. These guidelines help create sites that stand out and feel memorable.

### The Goal

Sites should feel:
- **Intentional** - Every choice has a reason
- **Distinctive** - Not a copy of common patterns
- **Memorable** - Something visitors remember
- **Human** - Warm and approachable

### Typography Guidance

Common fonts like Inter, Roboto, and system fonts work well but are everywhere. For distinction, explore alternatives:

**Modern & Clean:**
- Space Grotesk + DM Sans
- Outfit + Source Sans 3
- Sora + Nunito

**Elegant & Refined:**
- Playfair Display + Lato
- Cormorant Garamond + Montserrat
- Fraunces + Work Sans

**Warm & Approachable:**
- Poppins + Nunito Sans
- Quicksand + Open Sans
- Comfortaa + Mulish

These aren't rules—they're starting points. The right font depends on the brand.

### Color Guidance

**Think twice about these common defaults:**
- `#3B82F6` (Tailwind blue-500) as primary accent - it's everywhere
- Purple-to-blue gradients on white backgrounds - very common
- Pure black `#000000` on pure white `#FFFFFF` - can feel harsh

**Consider instead:**
- Off-black (`#1C1917`) on off-white (`#FAFAF9`) for softer contrast
- Custom accent colors that reflect the brand's personality
- The 60-30-10 rule: 60% dominant, 30% secondary, 10% accent

### Layout Guidance

**Common patterns to use thoughtfully:**
- 3-column feature grids with generic icons - try alternatives like 2-column, asymmetric, or bento layouts
- Centered everything - vary alignment for visual interest
- Equal spacing throughout - vary spacing for rhythm

**Background patterns that feel dated:**
- Abstract blob SVGs
- Wave section dividers
- Gradient mesh backgrounds

Alternatives: geometric shapes, grain textures, solid colors with intentional variation, or high-quality photography.

### Writing Guidance

**Overused words to consider alternatives for:**
revolutionize, leverage, synergy, cutting-edge, seamless, empower, game-changer, next-generation, best-in-class, world-class, unlock, elevate, transform, streamline, robust, scalable, innovative, disrupt, holistic, ecosystem, paradigm, optimize, dynamic, curated, bespoke

**Instead:** Be specific. Use numbers. Focus on outcomes. Write like a human talking to another human.

---

## CRITICAL: Maintain Documentation

**You MUST keep documentation updated.** This is essential for non-technical users.

### Files to Maintain

1. **`SITE.md`** - The main documentation file. Update EVERY time you make changes:
   ```markdown
   # [Site Name]

   > [One-sentence tagline]

   ## Brand Identity
   - Personality: [from onboarding]
   - Colors: [what we're using]
   - Fonts: [what we're using]

   ## Pages
   - **Homepage** (`/`) - [description of what's on it]
   - **About** (`/about`) - [description]

   ## Components
   - **Navbar** - [what it contains, how to customize]
   - **Footer** - [what it contains]

   ## Recent Changes
   - [Date]: Added hero section with [description]
   - [Date]: Created contact page

   ## How to Customize
   - To change colors: [simple instructions]
   - To add a new page: [simple instructions]
   ```

2. **Create `SITE.md` immediately** if it doesn't exist (via onboarding).

3. **Update `SITE.md` after EVERY change** - no exceptions.

4. **Use simple language** - Say "the main page" not "the root route". Say "the navigation bar at the top" not "the header component".

---

## Project Structure

```
app/
├── layout.tsx       # The wrapper around all pages (has <html>, <body>)
├── page.tsx         # Homepage - EDIT THIS for the main page
├── globals.css      # Global styles + Tailwind
└── [folders]/page.tsx  # Other pages (about/, contact/, etc.)
components/          # Reusable pieces (Navbar, Footer, etc.) - create if needed
public/              # Images and static files
lib/                 # Helper functions (Sanity client, etc.)
sanity/              # CMS configuration (if added via /sanity-cms)
```

---

## Rules for Building

### DO:
- Run `/onboarding` for new projects without SITE.md
- Check SITE.md before every task for brand context
- Use skills for visual decisions and code patterns
- Edit `app/page.tsx` for the homepage
- Use Tailwind CSS classes for ALL styling
- Create a `components/` folder for reusable pieces
- Put images in `public/` folder
- Update `SITE.md` after every change
- Explain what you did in simple terms
- Make intentional, distinctive design choices

### DON'T:
- NEVER create `.html` files - this is React/Next.js
- NEVER create separate `.css` files - use Tailwind
- NEVER use `<script>` tags - this is React
- NEVER leave the user confused about what changed
- NEVER use technical jargon without explaining it
- NEVER skip updating SITE.md

---

## File-Based Routing

Each folder in `app/` becomes a page:
- `app/page.tsx` → Homepage (yoursite.com)
- `app/about/page.tsx` → About page (yoursite.com/about)
- `app/contact/page.tsx` → Contact page (yoursite.com/contact)
- `app/pricing/page.tsx` → Pricing page (yoursite.com/pricing)

---

## Example: Creating a New Page

If the user asks for an "About" page:

1. Check `SITE.md` for brand personality
2. Use `marketing-site-design` skill to plan sections
3. Use `brand-identity` skill for visual consistency
4. Create `app/about/page.tsx` using `react-nextjs-expert` patterns
5. Write copy using `copywriting` skill guidelines
6. **Update `SITE.md`** using `documentation-writer` skill
7. Tell the user: "I created an About page. You can see it by going to /about in the preview."

---

## After Every Task

1. Make the requested changes (using your skills, following design principles)
2. Update `SITE.md` with what changed
3. Tell the user what you did in plain English
4. Let them know how to see the changes

---

## Adding CMS (When Requested)

When the user wants to edit content themselves, run the `/sanity-cms` skill. This will:
1. Set up Sanity CMS in the project
2. Create schemas for editable content
3. Connect the frontend to fetch CMS data
4. Give them a friendly editing dashboard

The `.mcp.json` file is already configured for Sanity. User authenticates via OAuth when first using Sanity tools.

---

## Remember

The user is NOT a developer. They're using Ship Studio to build a website without coding knowledge. Your job is to:

1. **Onboard them properly** (if no SITE.md)
2. **Build what they ask for** (using your skills)
3. **Make it feel distinctive and intentional** (not generic)
4. **Keep everything documented** so they understand their site
5. **Explain things simply**
6. **Make them feel confident** about their project

**Always use your skills. Always follow design principles. Always update SITE.md.**

---

# TraffiCorp project rules (read before every pass)

These override the generic design advice above wherever they conflict.

## Who this is for
The developer is a design engineer, not a beginner: be precise. `SITE.md` stays in plain language for the client.

## Never
- Never name, credit or allude to any external website, studio or design reference, in code, comments, copy, docs, commit messages or file names.
- Never use third-party assets. Allowed: TraffiCorp's own files (`public/images/brand`, `public/images/members`), line art drawn here, and Unsplash-licensed placeholders in `public/images/photos`.

## Tokens (see `app/globals.css`)
- Fluid root: `1rem = 10px` at 1728px desktop (`100vw/172.8`), 10px at 375px mobile. Tailwind spacing step = `0.1rem`, so `px-60` = 60px at design size. Small text sizes have px floors (`--text-12…20`) so they stay readable and zoom.
- Colours: **amber `#F79521` is the brand colour** (hover `#FFAB47`), ink `#151515`, body `#4B4B4B`, label `#6B6B6B`, asphalt `#111112`, night `#040608`, tile `#212121`, concrete `#EAEEF0`, paper `#F5F5F5`, danger `#B42318`. There is no orange token any more.
- **Amber is a surface, never text on white** (2.3:1). On light sections it carries ink (8:1): buttons, the `.tc-mark` sign mark (`<Mark>`), badges, cards. Amber text is fine on asphalt/night.
- Type: Inter Tight 500, sentence case, tight leading for headings. `text-h1…h6` = 10.4 / 8.4 / 7.2 / 6 / 3.6 / 3.2rem. Body 1.6–1.8rem. JetBrains Mono for plan-sheet labels, numbers, work orders.
- No numbered labels (01, Step 01, Rule 01…) in section content, and section labels sit above their headings. Draft or placeholder notes belong in SITE.md, not on the page.
- Section labels: `<SectionLabel>` renders a warning lamp (`<Lamp>`, `.tc-beacon` in globals, drawn like the board LEDs) and the name in mono caps, ink/80. No section numbers. The header's dispatch indicator uses the same `<Lamp>` (`lit={false}` after hours).
- Buttons: `<Button>` = amber label panel + ink arrow cell (`variant="dark"` inverts). Square corners, hairlines `ink/10–15`.
- Text links: `.tc-link` (amber underline slides in from the left on hover/focus, out to the right) or `.tc-link-rest` (amber underline at rest, current colour slides over it). Put `.tc-link-trigger` on a parent to drive it from the whole row. Link arrows are `ArrowRight`, 4px from the text, inside the underline.
- Grid: 16 columns, 20px gutters, 60px side padding, 1920px max (`Container`, `Grid`).
- Breakpoints are all px (`sm` 640, `md` 768, `lg` 1200, `xl` 1280). Keep them in one unit, or Tailwind can't order the variants (an `sm:` rule would beat `lg:`). `cn` doesn't merge conflicting classes, so don't override a component's base `grid-cols-*` through `className`.

## Accessibility (keep it at WCAG 2.2 AA)
- Re-run axe-core on every page after changes; check text over photos by sampling pixels (axe can't).
- Fade content with `opacity`, not `autoAlpha`/`visibility`, so it stays in the accessibility tree.
- Anything that moves for more than 5 s needs a pause control (`<MotionToggle>`) or a finite iteration count. The footer message board pauses on hover and focus and keeps its `<MotionToggle>` visually hidden until focused; keep that control, don't remove it.
- Reduced-motion paths must not depend on zero-duration GSAP timelines firing `onComplete`.
- Hidden-but-mounted controls must leave the tab order (`invisible` or `tabIndex={-1}`).
- `SplitText` takes `aria: "hidden"` (a screen-reader copy of the text); the default puts `aria-label` on the element, which is prohibited on `<p>` and `<div>`.

## Motion
- GSAP + ScrollTrigger + SplitText + DrawSVG via `useGSAP`, registered in `lib/gsap.ts`. Lenis via `components/providers/SmoothScroll.tsx`.
- Always wrap in `gsap.matchMedia()` with `MQ.desktop` / `MQ.mobile` / `MQ.motion`. No pinning below 1200px. With reduced motion, everything is drawn and visible immediately.
- The Line: one SVG segment per section, never a page-height path. `aria-hidden`, `pointer-events: none`. Amber, solid at the drawing tip, dashed lane paint once settled.
- `useGSAP` with `dependencies` that change after measuring must use `revertOnUpdate: true`, or "from" tweens stack and leave content hidden.
- Dot-matrix LEDs (loader, footer board, `LightField`) all come from `lib/led.ts`; boards switch LEDs on/off, they don't glow or fade.
- Don't use DrawSVG on paths with `vector-effect: non-scaling-stroke` inside stretched viewBoxes; size the viewBox to real pixels instead (`lib/useElementSize.ts`).
- GSAP folds an element's CSS `translate` into its own transform and can't read `calc()` offsets. Animate a plain anchor wrapper and keep Tailwind `translate-*` offsets on an inner element.
- Tailwind 4 `scale-*` and `translate-*` set the `scale` / `translate` properties, so CSS transitions must list those (`transition-[scale,opacity]`), not `transform`.

## Building pages
- Pages: `/`, `/about`, `/careers`, `/contact`. Assemble from `components/sections/*` and feed copy from `content/*.ts`. Company facts live in `lib/site.ts`.
- The preloader lives in the root layout (first load only; short cut on inner pages). Page fades come from `app/template.tsx`.
- Every section sets `data-header="dark" | "light" | "split"` so the header can recolour itself.
- Quote CTAs call `useQuote().open()`. `QuoteForm` is reusable for a `/quote` page.
