---
title: Button
group: Actions
order: 10
type: component
status: Draft
description: Triggers an action, such as submitting a form or opening a dialog.
figma:
---

## Overview

> [!TODO]
> **What it is and when to use it.** Two or three sentences, then when to pick this component and when to pick another one.

![Button overview](assets/images/button/overview.png)

## Anatomy

![Button anatomy](assets/images/button/anatomy.png)

> [!TODO]
> **Numbered parts.** List each part marked in the anatomy image: 1. Container · 2. Label · 3. Icon…

## Variants

> [!TODO]
> **Variants and sizes.** One image, pasted SVG or `preview` code block per variant, with a line on when to use it.
> ![Button variants](assets/images/button/variants.png)

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=109-1028&t=kLZIsNzzPl37Nkej-4

## States

> [!TODO]
> **States.** Default, hover, focus, active, disabled, loading, error — as an image, pasted SVG or `preview` code block.

![Button states](assets/images/button/states.png)

## Usage

> [!TODO]
> **Do and don't.** Rewrite the two boxes below. An image can go inside each box.

> [!DO]
> Replace with a correct usage example.

> [!DONT]
> Replace with a usage to avoid.

## Code

> [!TODO]
> **Full source.** Replace the example below with the real code. For React, open the block with `tsx component preview` so the other sections can render it.

```tsx component preview
function PrimaryButton({
  label = "Continua",
  loading = false,
  disabled,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 min-w-28 items-center justify-center rounded-lg border-0 bg-[#fd4ad0] px-4 py-3 font-['Bricolage_Grotesque:Medium'] text-base leading-5 font-medium whitespace-nowrap text-[#1c1c1c] transition-[background-color,box-shadow,transform] duration-150 hover:bg-[#f43ac4] active:translate-y-px active:bg-[#e92bb8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c1c1c] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      disabled={disabled || loading}
      style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
      type="button"
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-[#1c1c1c]/30 border-t-[#1c1c1c]"
        />
      ) : (
        label
      )}
      {loading && <span className="sr-only">Caricamento</span>}
    </button>
  );
}

export default function App() {
  const [activated, setActivated] = useState(false);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white p-6">
      <PrimaryButton label="Continua" onClick={() => setActivated(true)} />
      <p className="sr-only" aria-live="polite">
        {activated ? "Azione completata" : ""}
      </p>
    </main>
  );
}
```

```html component
<style>
  .button-primary {
    display: inline-flex;
    min-width: 112px;
    min-height: 44px;
    padding: var(--spacing-button-inset-vertical) var(--spacing-button-inset-horizontal);
    justify-content: center;
    align-items: center;
    gap: var(--spacing-button-icon-label);
    border-radius: var(--radius-md);
    border: var(--border-width-none) solid var(--border-primary-default);
    background: var(--surface-primary-default);
    color: var(--text-primary-default-on-colour);
    font-size: var(--font-ui-button-font-size);
    line-height: var(--font-ui-button-line-height);
    font-weight: 500;
  }
</style>
<button class="button-primary">Continua</button>
```

## Props

> [!TODO]
> **API table.** One row per prop, attribute or class modifier.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `primary`, `secondary` | `primary` | Visual style |

## Design tokens

```tokens
used: code
match: button
```

## Accessibility

> [!TODO]
> **Requirements.** Keyboard interaction, focus order, ARIA attributes, minimum contrast and target size.

## Figma

> [!TODO]
> **Figma link.** Paste the link to the component on a line of its own: it becomes an embedded frame. Add it to `figma:` at the top of this file too.

## Changelog

> [!TODO]
> **History.** `YYYY-MM-DD` — what changed.
