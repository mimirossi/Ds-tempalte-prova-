---
title: Editing guide
group: Get started
order: 20
description: How to add text, images, code, tokens and Figma frames to any page.
---

## Editing from the site

With **Edit mode** on, every section has an **Edit** button, and every yellow placeholder has an **Add content** link. Both open a panel where the section is a list of blocks: text, image, code, SVG, Figma link, do, don't, note. Fill them in, add or delete blocks, and press **Save**.

- **Sign in once.** The first time, the panel asks for an access code from GitHub and shows the four steps to get one. You need a GitHub account that can write to this repository.
- **Saved means published.** The change shows for you straight away and for everyone else about a minute later.
- **Page settings** changes the title, description, status, Figma link and place in the menu.
- **New component page** and **New foundation page**, at the bottom of the menu, create a page from the template.
- **Placeholders** say what belongs in each spot. Delete a placeholder once the content is in and the counter in the menu goes down.

Switch **Edit mode** off to see the site as developers will.

## How pages work

Behind the editor, every page is one Markdown file in the `content/` folder. The rest of this guide describes that format, for anyone who prefers to edit the files directly with **Edit on GitHub**.

## Page settings

The block between the `---` lines at the top of a file sets the page up.

```yaml
---
title: Button
group: Actions
order: 10
type: component
status: Draft
description: Triggers an action or event.
figma: https://www.figma.com/design/FILE/Name?node-id=1-2
---
```

| Field | What it does |
| --- | --- |
| `title` | Page title and sidebar label |
| `group` | Sidebar section. A new name creates a new section |
| `order` | Position inside the section, lowest first |
| `type` | `component` or `foundation`. Sections the template expects are flagged while missing |
| `status` | Free label next to the title: Draft, Beta, Stable, Deprecated |
| `description` | Line under the title, also used on overview cards |
| `figma` | Adds an "Open in Figma" button |

## Placeholders

A quote that starts with `[!TODO]` renders as a placeholder box. Delete it once the content is in.

```markdown
> [!TODO]
> **Anatomy.** Add the annotated image and list the parts.
```

## Images

Upload the file to `assets/images/<page-name>/`, then reference it. Text in quotes becomes the caption.

```markdown
![Button anatomy](assets/images/button/anatomy.png "The four parts of a button")
```

An image that is referenced but not uploaded yet shows a placeholder with the exact file name to upload, so the page template can list every image a page needs in advance.

## Code snippets

A fenced block gets syntax highlighting and a copy button.

```css title="button.css"
.button {
  border-radius: var(--radius-md);
}
```

Blocks with a `tab` label that follow each other are grouped. Adding `preview` to an HTML block renders it live, using the styles in `preview/preview.css`.

```html preview tab="HTML"
<button class="example-button">Primary</button>
<button class="example-button secondary">Secondary</button>
```

```jsx tab="React"
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
```

That group is written like this:

````markdown
```html preview tab="HTML"
<button class="example-button">Primary</button>
```

```jsx tab="React"
<Button>Primary</Button>
```
````

## React components

A `jsx` or `tsx` block with `preview` is compiled and rendered in the page. Tailwind classes work inside previews.

Add `component` to the block that holds the full source of a component. It can sit anywhere on the page, usually in the Code section at the end, and every other preview on the same page can then use the component by name. That way each section shows only the code for its own detail.

````markdown
## Variants

```tsx preview
<Button variant="Secondary" label="Secondary" />
<Button variant="Outline" label="Outline" />
```

## Code

```tsx component preview title="button.tsx"
export default function Button({ label = "Button", variant = "Default" }) {
  return <button className="px-4 h-10 rounded-lg">{label}</button>;
}
```
````

The same works without React: flag an HTML block that holds the component's `<style>` with `component`, and the other HTML previews on the page can use its classes, so each one is a single line such as `<button class="button-primary" disabled>Label</button>`.

Three things to know:

- The opening line is for the language and the flags; the code starts on the next line. A block with no language, or with code pasted right after the backticks, is detected automatically: React, HTML and SVG get a preview.
- `import` lines are ignored in previews. React and its hooks are available; other packages are not.
- Code only names a font; the font file has to be on the site. Upload it to `preview/fonts/` and it is picked up on its own. The default text font in previews is the first one under `preview.fonts` in `site.config.json`.
- CSS classes that are not Tailwind, such as `.button-base`, must be defined in `preview/preview.css`. The Tailwind theme goes in `preview/tailwind.css`.

## SVG

Paste the SVG in an `svg` block with `preview` to show the drawing with its code in a second tab. Pasted straight into the page, outside any block, it shows as a drawing only.

```svg preview
<svg width="120" height="48" viewBox="0 0 120 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="118" height="46" rx="12" fill="none" stroke="currentColor" stroke-width="2" />
  <circle cx="26" cy="24" r="8" fill="currentColor" />
  <rect x="44" y="20" width="56" height="8" rx="4" fill="currentColor" />
</svg>
```

## Do and don't

> [!DO]
> Use one primary button per view.

> [!DONT]
> Don't place two primary buttons side by side.

```markdown
> [!DO]
> Use one primary button per view.

> [!DONT]
> Don't place two primary buttons side by side.
```

`[!NOTE]` and `[!WARNING]` work the same way.

> [!NOTE]
> Notes are for context developers should not miss.

## Design tokens

Export the variables from Figma as JSON and upload the files to `tokens/`. A `tokens` block turns a file into a table with swatches and copyable CSS variable names. `path` limits the table to one group.

```tokens
file: tokens/example.tokens.json
path: color
```

````markdown
```tokens
file: tokens/example.tokens.json
path: color
```
````

Uploading a newer export under the same file name updates every table that reads it.

### Tokens used by a component

On a component page, this block lists the tokens the code on the page refers to, plus every token whose name contains the word after `match`. Nothing to maintain by hand: it follows the code.

````markdown
```tokens
used: code
match: button
```
````

### Tokens in code

Every token also becomes a CSS variable, with the name shown in the last column of the table. Previews load these variables, so component code can use them and follows the tokens when they change:

```css
.button {
  background: var(--color-action-primary);
  border-radius: var(--radius-md);
}
```

Colour tokens work as Tailwind classes too: a token named `action/primary` gives `bg-action-primary`, `text-action-primary` and `border-action-primary`. A file with `dark` in its name, such as `dark.tokens.json`, applies when the dark theme is on. The full list of variables is published at `tokens/tokens.css` for developers to link or copy.

## Figma

Paste a Figma link on a line of its own and it becomes an embedded frame. Use **Copy link to selection** in Figma so the embed opens on the right component.

```markdown
https://www.figma.com/design/FILE_KEY/File-name?node-id=12-345
```

People viewing the page need view access to the Figma file to see the embed.

## Tables

```markdown
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `sm`, `md`, `lg` | `md` | Height of the control |
```

## Site settings

`site.config.json` holds the site title, the order of sidebar sections, the sections each page type must have, and the repository the edit links point to. `app/theme.css` holds fonts and colours of the site itself.
