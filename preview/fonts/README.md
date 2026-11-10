# Preview fonts

Upload the design system's font files here (`.woff2` preferred), then list each one under `preview.fonts` in `site.config.json`:

```json
"fonts": [
  { "family": "Inter", "src": "preview/fonts/Inter-Variable.woff2", "weight": "100 900" },
  { "family": "Brand Serif", "src": "preview/fonts/BrandSerif-Bold.woff2", "weight": "700", "figmaStyle": "Bold" }
]
```

- `weight`: a range (`"100 900"`) for a variable font, a single value for a static file.
- `figmaStyle`: for a static file, the style name Figma uses (`Regular`, `Medium`, `Bold`…), so code copied from Figma finds the font.
- The first font in the list is the default text font in previews.
