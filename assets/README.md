# Rose illustration kit

All artwork is original, drawn for Rose Stil Stüdyosu. No external image downloads, stock artwork or remote image dependencies.

- `wardrobe/`: 33 individual, transparent, editable SVG assets (360 × 640 registration canvas).
- `src/wardrobe.ts`: source paths, names, category metadata and school/sport/home presets.
- `src/Illustration.tsx`: character drawing, three illustrated rooms, interface icons and layer composition.

The files in `wardrobe/` are artist-facing exports of the exact paths used at runtime, not independent duplicates to edit. Change the source paths, then run `node scripts/export-assets.cjs` to regenerate and validate them.

Layer order: hair/face, covered body base, footwear, bottoms, tops, makeup, accessories. All assets share coordinates, so any top/bottom/footwear selection stays registered. Artwork never requires a separate download at runtime.

The character is a fictional 17-year-old student with black hair, light skin and almond-shaped eyes. Clothing and makeup are everyday, age-appropriate styles.
