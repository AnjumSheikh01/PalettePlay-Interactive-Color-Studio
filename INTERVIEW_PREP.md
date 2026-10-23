# PalettePlay Interview Prep

## 30-second explanation
PalettePlay is a responsive React color studio. Users can generate palettes, lock colors, edit hex values, save palettes in browser storage, preview colors on a sample landing page, and export CSS variables.

## Technical questions
- **Why React?** To build reusable UI and keep it synchronized with state.
- **How does shuffle work?** Generate a random 24-bit number, convert it to six-digit hexadecimal, and map over the palette while preserving locked indices.
- **Why immutable arrays?** `map` and `filter` return new arrays instead of mutating existing state.
- **How is data saved?** LocalStorage serializes data using JSON; it is browser/device-specific, not cloud storage.
- **How does the preview update?** CSS custom properties are derived from current React state.
- **How does CSS export work?** Create a CSS string, wrap it in a Blob, create an object URL, and trigger a download.
- **Limitations?** No backend, accounts, cloud sync, or guaranteed accessible contrast.
- **What next?** Add a WCAG contrast checker, RGB/HSL conversion, JSON export, shareable links, and keyboard accessibility.

Answer based on what you actually tested; don't invent challenges or claim untested features.
