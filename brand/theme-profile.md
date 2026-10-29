# River — cross-platform theme profile

Reusable art direction and prompt reference for River AI TCG.

Source: the local landing page in [`index.html`](../index.html), [`styles.css`](../styles.css), and [`script.js`](../script.js), plus the existing logo and app screenshots. Extracted September 17, 2026. This describes the checked-out website, not a separate audit of the live deployment.

**Status key:** “Website” means an observed implementation value or existing copy. “Social adaptation” means a proposed rule for translating that design into Instagram and other branded content. These proposals are not pre-existing brand standards or platform upload requirements.

Open [`theme-board.html`](theme-board.html) for a visual reference. Use [`theme-tokens.json`](theme-tokens.json) when a tool accepts structured theme input.

## 1. Creative identity

**One-line direction:** Calm, spacious blue product design for collectors: icy backgrounds, deep navy type, soft dimensional cards, and a clear view of the collection.

The website pairs a restrained interface with colorful, recognizable trading cards. Its visual energy comes from the cards and product demonstration; the surrounding design stays quiet. Large type, generous breathing room, pill shapes, and soft blue depth make the product approachable and polished.

| Quality | How it appears |
| --- | --- |
| Clarity | Short benefit headlines, distinct hierarchy, simple actions, generous spacing |
| Confidence | Deep navy text, large clean type, real app screens, specific collector language |
| Ease | Rounded surfaces, floating objects, gradual motion, uncluttered compositions |
| Collector enthusiasm | Real card artwork, binders, card fans, exact prints and variants |
| Cohesion | Blue-tinted backgrounds, borders, shadows, highlights, and dark sections |

These qualities are an interpretation of the page, not a formal company mission. Suggested voice: knowledgeable, calm, direct, helpful, and enthusiastic about collecting without becoming loud.

**Useful prompt vocabulary:** airy, cool blue, mist blue, deep navy, softly dimensional, clean sans serif, generous negative space, subtle translucency, rounded product panels, authentic trading cards, precise hierarchy, gentle floating motion.

## 2. Color system — website values

| Role | Value | Source / intended use |
| --- | --- | --- |
| Primary ink | `#0B2343` | `--black`; main headings and text. The token name means navy here. |
| Secondary ink | `#5F748C` | `--gray`; body copy and supporting text |
| Muted headline | `#5C7592` | Second line of the hero heading |
| River deep | `#1D52A2` | `--river-deep`; anchors and blue accents |
| River blue | `#358FE3` | `--river-blue`; highlights, indicators, and glow |
| River sky | `#8FC6F2` | `--river-sky`; light accents and buttons on dark panels |
| River mist | `#EAF6FF` | `--river-mist`; primary light background |
| Panel blue | `#DCEEFF` | `--panel`; soft surface and background stop |
| Background highlight | `#EFF8FF` | Lighter stop in the page background |
| CTA highlight | `#3A98E8` | Bright end of primary button gradient |
| Dark surface | `#071D3D` | Deepest blue in dark feature and closing sections |
| Dark section start | `#173F7F` | Start of the experience-section gradient |
| Featured panel start | `#205EAF` | Pricing highlight and closing-panel gradient |
| Featured panel end | `#123D79` | Pricing highlight; text on sky buttons |
| Inverse ink | `#FFFFFF` | Headings on dark backgrounds |
| Inverse secondary | `#B9D7F1` | Supporting copy on dark sections |
| Hairline border | `rgba(29,84,148,0.20)` | `--line`; restrained dividers and outlines |

**Social adaptation:** In a typical light post, aim for roughly 70% mist/panel background, 20% imagery and navy structure, and 10% bright blue accents. This is a composition guide, not a measured website ratio. Let card artwork retain its original colors. Green can remain inside genuine product screenshots or truthful positive-status data; it is not a second brand accent.

Use navy for essential text on pale backgrounds. Reserve sky blue for fills, larger accents, and text against deep blue. Keep muted text large enough to read at phone size; the quieter website label colors should not become tiny social copy.

## 3. Gradients, light, and depth — website values

```css
/* Whole-page background */
linear-gradient(180deg, #eaf6ff 0%, #dceeff 24%, #eff8ff 56%, #dceeff 100%);

/* Primary action */
linear-gradient(145deg, #3a98e8, #1d52a2);

/* Light product panel */
radial-gradient(circle at 74% 42%, rgba(143,198,242,.55), transparent 30%),
linear-gradient(145deg, #e9f6ff 0%, #cfe6fa 100%);

/* Dark product story */
linear-gradient(145deg, #173f7f 0%, #071d3d 100%);

/* Featured offer */
linear-gradient(145deg, #205eaf 0%, #123d79 100%);

/* Closing campaign panel */
linear-gradient(145deg, #205eaf 0%, #0c2d61 72%, #071d3d 100%);
```

Light is broad and diffused. Objects have soft shadows below them, with a blue glow around the phone. Translucency appears on badges, navigation, and panels; avoid making every surface look like glass.

Representative website effects:

- Trading card: `0 18px 50px -16px rgba(0,0,0,.5)`.
- Primary button: `0 14px 30px -18px rgba(29,82,162,.85)`.
- Featured panel: `0 30px 70px -32px rgba(29,82,162,.65)`.
- Phone glow: `radial-gradient(circle, rgba(53,143,227,.34), rgba(143,198,242,.14) 42%, transparent 72%)`, blurred `18px`.
- Light pill fill: `rgba(239,249,255,.62)`; badge fill: `rgba(239,249,255,.55)`.

**Social adaptation:** Preserve the direction and softness of shadows when scaling up. Use one local glow behind the subject, with sharp artwork in front. Do not blur the product itself.

## 4. Typography

**Website family:** Google Sans, with `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif` fallbacks. Google Sans Code is loaded by the page but is not assigned to the main landing-page typography; it is not a defining part of this theme.

| Role | Website specification |
| --- | --- |
| Desktop hero | 68px, 400 base weight, 700 on the first emphasized line, 1.06 line height, −0.025em tracking |
| Hero secondary line | 400 weight, muted `#5C7592` |
| Main section heading | Usually 50–52px, 400 weight, about −0.025 to −0.035em tracking |
| Feature title | 36px, 400 weight, −0.025em tracking |
| Supporting copy | 15–17px, usually 1.5–1.55 line height |
| Buttons and badges | Usually 14px; medium or regular weight |
| Eyebrow / sequence | 10–12px, 500–600 weight, about +0.08 to +0.10em tracking |
| Mobile hero | 37px, 1.04 line height |

**Social adaptation for a 1080px-wide artboard:**

- Headline: 80–112px, 1.02–1.10 line height, −0.025em tracking, usually 2–3 lines.
- Supporting line: 36–44px, 1.35–1.5 line height.
- Eyebrow, logo label, and short metadata: 24–28px. Essential information belongs in larger text.
- CTA: 30–36px within a simple pill.
- Use one family. Prefer Google Sans when available; otherwise use an available close sans-serif such as the website’s Arial fallback and keep that choice consistent across the series.
- Mix one bold phrase with regular-weight text. Preserve the website’s light typographic feel rather than setting every line in bold.
- Sentence case for headlines. Small uppercase labels are an accent, not the main voice.

## 5. Shape, spacing, and composition

**Website:** Pill corners use `999px`; content panels use `24px`; menu surfaces use `28px`; the closing panel uses `38px`; phone shells use about `48–49px`. Actual trading-card images use only `5px` rounding. Keep the card silhouette distinct from the surrounding UI.

The desktop page uses a text-led hero with imagery to the right, generous section breaks, fine horizontal rules, numbered features, centered campaign closures, and a sequence of pale sections punctuated by deep-blue panels. Typical desktop edge padding is 40px; mobile edges are about 18–20px. These CSS pixel values should not be copied directly onto a 1080px social canvas.

**Social adaptation:**

- Working artboards: 1080 × 1350 for portrait feed/carousel designs, 1080 × 1080 for square variants, and 1080 × 1920 for vertical stories/reels. These are chosen production templates, not a statement of current platform limits.
- Start with 72px outer margins on feed designs and a 12px spacing unit: 12, 24, 36, 48, 72, 96.
- On vertical story designs, start with 90px side margins and reserve roughly 250px at top and bottom for interface overlap. Check the actual placement preview before publishing; these are conservative layout guides, not guaranteed safe zones.
- Rounded social panels: about 48px radius. Pills remain fully rounded. Trading cards keep their natural proportion and corners.
- Keep roughly one-third of the composition visually quiet. Show one idea, one main subject, and one CTA at most.
- In tall layouts, put the headline above a phone or card fan. In wider layouts, use text on the left and the subject on the right.
- Keep a repeatable brand position, such as the top-left logo plus “River,” and a repeatable bottom CTA position across a series.
- Use a thin rule and `01 / 05` style numbering for educational carousels.

## 6. Imagery, logo, and motifs

**Existing logo:** [`river-logo.png`](../river-logo.png). It is a glossy blue circular mark with layered wave shapes and a pale highlight. Reuse the actual asset. “River” in the footer is large, low-opacity text, not evidence of a separate supplied wordmark asset.

**Social adaptation for logo use:** Keep its aspect ratio, original colors, and at least half the displayed logo diameter as surrounding clear space. Do not redraw the wave mark, add a new mascot, stretch it, or turn it into a watermark over the headline.

**Primary subjects:**

| Asset | Use |
| --- | --- |
| [`screens/collections.webp`](../screens/collections.webp) | Collection overview and binders |
| [`screens/scanner.webp`](../screens/scanner.webp) | Single-card identification |
| [`screens/binder-scan.webp`](../screens/binder-scan.webp) | Binder scanning |
| [`screens/card-detail.webp`](../screens/card-detail.webp) | Exact card match and detail |
| [`screens/configure-raw.webp`](../screens/configure-raw.webp) | Raw condition configuration |
| [`screens/configure-graded.webp`](../screens/configure-graded.webp) | Graded configuration |
| [`screens/chat.webp`](../screens/chat.webp) | River AI conversation |
| [`screens/vending.webp`](../screens/vending.webp) | Selling inventory |

Screenshots are existing website assets, not verified current market reports. If numbers in a screenshot are not the subject of the post, present it as an app demonstration. If promoting a specific price, change, or capability, verify that claim separately before publishing.

The website also uses externally hosted trading-card images. For repeatable social production, supply the exact desired card image as a reference asset instead of asking an image model to invent its artwork, lettering, edition, or price. Preserve card proportions: 2.5:3.5, or 5:7.

**Signature motifs:**

- A restrained floating-card arrangement; for social, usually one hero card or a fan of 3–5.
- A symmetrical fan with outer cards tilted around ±13° and inner cards around ±7°, matching the closing website section.
- A nearly upright dark phone shell with real River screens and a soft blue halo.
- A small outlined capsule above the headline.
- A pale highlight behind a key phrase or a quiet oversized “River” crop at the edge.

Abstract waves can echo the logo sparingly, but elaborate water scenes are not part of the landing page’s core visual language. The website is primarily product imagery and typography, not lifestyle photography.

## 7. Motion direction

**Website:** Repeated ease `cubic-bezier(.22,.68,.35,1)`; small interface transitions often 0.35–0.55 seconds; hero copy enters over 1 second with a 24px upward travel; cards float on a 5-second loop. The card fan uses a gentle 4px lift and about 1.5° extra rotation.

**Social adaptation:** Let elements settle gently into place. Use slow drifting cards, a restrained phone reveal, or a gradual background glow. A 5–8 second loop can show one action with a readable pause. Retain a useful still frame. Avoid shaking, flashing, frantic zooms, and constant movement behind copy.

## 8. Copy and brand voice

Existing website language includes “Track every card,” “in your collection,” “Your collection, understood.” and “Ready to know what you own?” These communicate ownership, clarity, and ease.

**Social adaptation:** Lead with a collector’s task or benefit, then one short explanation and a direct action. Use ordinary verbs: scan, identify, track, compare, organize, collect. Name specific card details when useful. Treat AI as a useful product capability instead of making every post about AI.

| Use | Avoid |
| --- | --- |
| “Your collection, understood.” | “The ultimate revolutionary collecting ecosystem.” |
| “See your cards in one place.” | “Unlock unprecedented portfolio mastery.” |
| “Scan. Identify. Keep collecting.” | “INSANE AI MAGIC!!!” |
| “See how River works.” | Unsupported guarantees or invented market gains |

Suggested content pillars: collection organization, scanning walkthroughs, raw/graded pricing education, collecting details, and product demonstrations. Keep launch-specific claims, availability, pricing, and card counts out of the permanent style prompt.

## 9. Reusable master prompt

Copy this block into a design or image prompt, then append one recipe and your exact content. Attach the real assets named in the brief; filenames alone do not provide an image model with those files.

```text
Create a River AI TCG branded social graphic with the visual identity of its
website: calm, spacious, polished product design for trading-card collectors.

Use mist blue #EAF6FF and panel blue #DCEEFF for the light environment,
deep navy #0B2343 for main text, muted blue-gray #5F748C for supporting copy,
River blue #358FE3 and deep blue #1D52A2 for accents, and sky #8FC6F2 for
soft highlights. Primary accents may use a restrained 145-degree gradient
from #3A98E8 to #1D52A2. A dark variant uses #173F7F to #071D3D,
white headings, and #B9D7F1 supporting text. Card artwork keeps its colors.

Use Google Sans if available, otherwise the specified consistent sans-serif
fallback. Set large sentence-case headlines with tight tracking near -0.025em
and short line lengths. Mix one bold phrase with regular-weight supporting
type. Keep body copy brief and clearly readable on a phone.

Build a clear hierarchy with generous empty space, rounded panels, thin
blue-tinted borders, simple capsules, soft downward shadows, and one subtle
blue glow behind the subject. Feature one main phone or authentic card
arrangement. Preserve attached app screens, card artwork, and logo exactly.
Use the supplied River logo in its original proportions and colors.

Keep the result calm and collector-focused. Exclude neon rainbow lighting,
purple/pink accent palettes, hard black outlines, distressed textures,
comic lettering, crowded sticker layouts, confetti, excessive glass effects,
invented cards, redesigned logos, fabricated app interfaces, and unprovided
prices or performance claims.

FORMAT: [canvas dimensions and placement]
VARIANT: [light or deep blue]
OBJECTIVE: [one message]
HEADLINE: [exact text]
SUPPORTING LINE: [exact text, or none]
CTA: [exact text, or none]
ASSETS: [attached logo + exact screenshot/card reference]
LAYOUT: [one recipe below]

Use only the supplied copy; do not add claims, badges, statistics, or captions
inside the artwork. If exact typography or asset compositing is unavailable,
create the background and composition with reserved empty areas, then add
the real text, logo, cards, and screenshots in the design editor.
```

## 10. Instagram prompt recipes

Append one of these to the master prompt. The text below is suggested campaign copy, not a claim that these designs already appear on the website.

### A. Product introduction — light portrait

```text
FORMAT: 1080 × 1350 portrait feed graphic.
VARIANT: Light.
OBJECTIVE: Introduce River as a collection companion.
HEADLINE: “Your collection, understood.”
SUPPORTING LINE: “See your cards in one place.”
CTA: “Explore River”
ASSETS: Supplied River logo and collections.webp.
LAYOUT: 72px edge margins. Small brand lockup at top left, two- or three-line
navy headline beneath it, brief supporting line. Center the real collection
screen in a dark rounded phone in the lower half with a soft blue halo.
Keep the phone and CTA separated; retain generous quiet space around both.
```

### B. Card spotlight — light portrait

```text
FORMAT: 1080 × 1350 portrait feed graphic.
VARIANT: Light.
OBJECTIVE: Spotlight one specific card and its details.
HEADLINE: “[Supplied card name]”
SUPPORTING LINE: “[Supplied set name and card number]”
CTA: “Explore the details”
ASSETS: Supplied River logo and exact card image.
LAYOUT: Small “Card spotlight” capsule, short navy headline, then one large
authentic card floating near the center with a slight tilt and soft shadow.
Use the card artwork for visual color. Leave the background pale and simple.
Do not add a market price unless a verified value and date are supplied.
```

### C. Educational carousel — five slides

```text
FORMAT: Five coordinated 1080 × 1350 slides.
OBJECTIVE: Explain one supplied collecting topic clearly.
SLIDE 1: “[Topic hook]” with one relevant card or product screenshot.
SLIDE 2: “[First point]” and one short supporting sentence.
SLIDE 3: “[Second point]” and one short supporting sentence.
SLIDE 4: “[Third point]” and one short supporting sentence.
SLIDE 5: “Your collection, understood.” with “Explore River.”
ASSETS: Supplied River logo and only the supplied topic-relevant images.
LAYOUT: Keep the logo, 72px margins, headline baseline, type scale, and
01 / 05 numbering in the same positions. Slides 1–4 use mist backgrounds,
thin blue rules, navy text, and one idea per slide. Slide 5 uses the deep-blue
gradient, white type, and a sky-blue CTA pill. Do not invent educational facts.
```

### D. Feature announcement — deep-blue portrait

```text
FORMAT: 1080 × 1350 portrait feed graphic.
VARIANT: Deep blue, #173F7F to #071D3D.
OBJECTIVE: Explain one confirmed feature.
HEADLINE: “[Supplied feature benefit]”
SUPPORTING LINE: “[One supplied sentence explaining it]”
CTA: “See how it works”
ASSETS: Supplied River logo and the exact relevant River screen.
LAYOUT: White headline above an upright dark phone; pale-blue supporting
copy, restrained blue halo, sky-blue CTA. Use a small feature-name capsule.
Let the dark area feel rich and quiet; keep all essential text unobstructed.
```

### E. Story or reel cover — vertical

```text
FORMAT: 1080 × 1920 vertical composition.
VARIANT: Light.
OBJECTIVE: Introduce the card-scanning workflow.
HEADLINE: “Scan. Identify. Keep collecting.”
SUPPORTING LINE: None.
CTA: “Meet River”
ASSETS: Supplied River logo and scanner.webp.
LAYOUT: Keep essential content inside a central area with 90px side margins
and roughly 250px breathing room at top and bottom. Place the logo above
the headline, the real phone screen beneath, and the CTA below the phone.
For an animated version, reveal the headline gently, then settle the phone
into place over a soft blue glow. Hold a readable frame before looping.
```

## 11. Consistency check before export

- Does it read as River through the mist/navy/blue palette, typography, and actual logo?
- Does one idea dominate, with a clear reading order and generous quiet space?
- Are card artwork and app screens accurate, sharp, and proportionate?
- Is every word readable when the artwork is viewed at phone size?
- Are essential text and branding clear of cropping and interface overlays?
- Are all numbers and product claims supplied or verified for this post?
- Do the margins, logo placement, radii, and type hierarchy match the rest of the series?

**Keep fixed:** palette roles, font family, calm voice, logo asset, shape language, and hierarchy. **Vary:** subject, light/dark variant, crop, card arrangement, and message.
