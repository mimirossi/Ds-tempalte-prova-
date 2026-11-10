# Design System library template

A documentation site for a design system: a navigable sidebar, one page per foundation or component, and copy-ready code for developers. Pages are Markdown files, so content is added from the GitHub website with no tools to install.

Every page starts from a template full of placeholders that list what still has to be added. The sidebar counts the placeholders left on each page.

## Adding content

Open the site, keep **Edit mode** on, and use the links on the page:

| To do this | Use |
| --- | --- |
| Change a page | **Edit this page** → edit the Markdown → Commit changes |
| Add images | **Upload images** → drop the files → Commit changes |
| Add a page | **New component page** / **New foundation page** in the sidebar |
| Add tokens | Upload Figma variable exports to `tokens/` |

The site republishes about a minute after each commit. The full syntax, with examples, is on the site under **Get started → Editing guide** (`content/get-started/editing-guide.md`).

## Structure

```
content/            One Markdown file per page
  _templates/       Starting point for new pages
  foundations/      Colors, typography, spacing…
  components/       Button, card, input…
assets/images/      One folder of images per page
tokens/             Figma variable exports (JSON)
preview/preview.css CSS loaded inside live previews: put the design system's CSS here
preview/tailwind.css Tailwind theme used inside live previews
site.config.json    Title, sidebar order, required sections, repository
app/                The site itself (theme.css holds its fonts and colours)
```

## Showing components from code

Besides images, a page can render code: HTML, pasted SVG, and React (`jsx` / `tsx`) with Tailwind classes. Mark the full source of a component with `component` and the other sections of the page can render it with a few lines each. Details in the Editing guide.

## Working with Figma

- **Tokens**: export variables from Figma as JSON into `tokens/`; token tables read them directly, and every token becomes a CSS variable (published as `tokens/tokens.css`) that previews and developers can use.
- **Frames**: a Figma link on its own line in a page becomes an embedded frame.
- **Code Connect**: this repository can be the code source Figma's Dev Mode links components to.
- **Back-links**: add each page's URL to the component in Figma (Dev Mode → Dev resources) so developers land here.

## Publishing

`.github/workflows/deploy.yml` publishes to GitHub Pages on every push to `main`. One-time setup: **Settings → Pages → Source: GitHub Actions**.

## Starting a new design system from this template

1. On GitHub choose **Use this template → Create a new repository** (or fork it).
2. In the new repository: **Settings → Pages → Source: GitHub Actions**, then run the "Deploy to GitHub Pages" workflow once from the **Actions** tab, or push any change.
3. Set the site title in `site.config.json`.

On GitHub Pages the edit links find the repository from the site address, so they point to the copy without any change. `repo` in `site.config.json` is only used with a custom domain or on a local preview.

## Local preview

```bash
node scripts/build-manifest.mjs
node scripts/build-tokens.mjs
python3 -m http.server 8000
```

Then open http://localhost:8000.
