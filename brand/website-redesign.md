# River website — approach B: Product Studio

Branch: `design/river-product-studio`.

The previous light, Monarch-inspired approach is saved on `design/river-monarch` (commit `d73a7f5`). This second direction uses Linear's product presentation patterns from Mobbin. References establish visual inspiration, not conversion results.

## References inspected

- Centered hero and large product showcase: https://mobbin.com/sites/sections/40a46191-a57a-4bab-9a92-94fc14cad817
- Dark feature panels: https://mobbin.com/sites/sections/fd00bc30-e30d-4d21-bbd5-e7bf82aa681d
- Product detail presentation: https://mobbin.com/sites/sections/ac08f1c7-d536-4996-91cc-85da059dcade

## Direction

Dark mode throughout, including legal pages. Modern Manrope headlines, quiet Google Sans supporting text, charcoal surfaces, slate borders, pale blue accents, and high-contrast download buttons. A centered headline leads into three real River app screens. Feature selection sits beneath a wide preview; bordered cards organize workflows and additional capabilities.

- Background: #090c12
- Primary text: #edf1f7
- Secondary text: #a1aaba
- Blue highlight: #9ebfff
- Panel: #111720
- Border: #293241

`studio.css` contains the alternative layout and palette over shared base styles. All app images are existing River screenshots. Pricing and legal text are preserved. Arrow keys navigate the feature selector; billing choices update the displayed price, with subscriptions selected inside the app.

The September theme profile, board, and tokens remain historical references for the earlier website and social assets.

Neither branch has been published or measured in a conversion experiment.

## Validation

Browser checks passed at 1440, 768, 390, and 320px, including feature selection and keyboard navigation, all billing options, mobile menu/Escape, internal anchors, legal pages, and absence of runtime errors. Desktop and mobile screenshots were visually reviewed. Legal text matches the saved first design.
