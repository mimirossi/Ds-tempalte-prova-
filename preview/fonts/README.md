# Preview fonts

Upload the design system's font files here (`.woff2`, `.woff`, `.ttf` or `.otf`). Nothing else is needed: on publish, the family name, weight and style are read from each file and the font becomes available in every live preview, also under the names Figma writes in exported code (`Family:Medium`).

The default text font in previews is the first one listed under `preview.fonts` in `site.config.json`. Change that entry to make an uploaded font the default:

```json
"fonts": [
  { "family": "Inter", "src": "preview/fonts/Inter-Variable.woff2", "weight": "100 900" }
]
```
