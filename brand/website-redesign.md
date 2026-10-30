# River website — Bevel-inspired direction

Current branch: `design/river-product-studio`. The original light design remains on `design/river-monarch`.

## References

Inspected Bevel's live homepage and these Mobbin sections:

- Live homepage: https://www.bevel.health/
- Additional feature selector: https://mobbin.com/sites/sections/6c021d8c-0dff-4d1d-9eb0-a091e30af6f0
- Intelligence section: https://mobbin.com/sites/sections/b619fd46-b1e8-4e4a-bd6c-f02b6baaa4a6
- Closing download section: https://mobbin.com/sites/sections/f051fa2e-d46c-4db9-8046-bdd726b28a7d

## Adaptation

Floating pill navigation, expansive rounded hero, oversized overlapping product imagery, rounded feature cards, a centered intelligence section, and a vertical additional-feature selector. Retains the user's dark-mode preference, River branding, modern Manrope typography, and genuine River app screens. The atmospheric hero is rendered with CSS; no Bevel imagery, ratings, testimonials, or product claims are reused.

Subscription pricing, plans, billing controls, and plan-related FAQ entries remain removed. Card valuation features remain. Legal content is unchanged, with matching dark surfaces and rounded navigation.

`studio.css` contains the current design over the shared base styles. The September theme profile, board, and tokens remain historical references.

## Validation

Browser checks passed at 1440, 768, 390, and 320px: no horizontal overflow, functioning feature selection and keyboard controls, mobile menu/Escape, valid internal anchors, rendering legal pages, and no runtime errors. Confirmed the plans section is absent. Reviewed desktop and mobile screenshots.

Changes are local and have not been published or measured in a conversion experiment.

## River color alignment

Uses the established brand palette: deep navy #071D3D, navy #0B2343, River deep #1D52A2, River blue #358FE3, sky #8FC6F2, and mist #EAF6FF. Dark panels, glows, buttons, and legal pages share these blue tones. Navigation and footer wordmarks use “River”.
