---
title: Badge
group: Display
order: 20
type: component
status: Draft
description: A small pill that labels an item with a genre, a status or a count.
figma: https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=153-19659
---

## Overview

A badge is a short label attached to something else: the genre of a set ("HOUSE / SOUL"), the status of an event ("LIVE", "SOLD OUT"), a count. It is information, not an action: it cannot be clicked and never replaces a button.

Use a badge when the label helps people **scan** a list or a card. For a message that needs attention use an [alert](#/components/alert); for something people can toggle or remove, use a dedicated control.

```html preview
<div class="ds-stage">
  <span class="badge"><span class="badge__dot"></span>House / Soul</span>
  <span class="badge badge--lime"><span class="badge__dot"></span>Live</span>
  <span class="badge badge--success"><span class="badge__dot"></span>Posti liberi</span>
  <span class="badge badge--error"><span class="badge__dot"></span>Sold out</span>
</div>
```

## Anatomy

```html preview
<div class="ds-stage">
  <span class="ds-anat">
    <span class="badge badge--lime"><span class="badge__dot"></span>Live</span>
    <span class="ds-pin" style="top:-18px;left:-18px">1</span>
    <span class="ds-pin" style="bottom:-18px;left:2px">2</span>
    <span class="ds-pin" style="bottom:-18px;left:34px">3</span>
  </span>
</div>
```

1. **Container.** Pill (`--radius-full`), 24px high, with the tag-badge spacing tokens. Tinted tones also get a 1px border.
2. **Dot (optional).** 8px circle in the text colour. It repeats the meaning of the colour for people who cannot tell the tones apart.
3. **Label.** One or two words, uppercase or sentence case but consistent across the product, `font/ui/label`.

## Variants

Seven tones and two sizes. Tone says what the badge means, size says how much room there is.

```html preview
<div class="ds-grid" style="grid-template-columns: repeat(4, auto);">
  <div class="ds-col"><span class="badge"><span class="badge__dot"></span>Neutro</span><span class="ds-cap">Neutro</span></div>
  <div class="ds-col"><span class="badge badge--pink"><span class="badge__dot"></span>Rosa</span><span class="ds-cap">Rosa</span></div>
  <div class="ds-col"><span class="badge badge--lime"><span class="badge__dot"></span>Lime</span><span class="ds-cap">Lime</span></div>
  <div class="ds-col"><span class="badge badge--info"><span class="badge__dot"></span>Info</span><span class="ds-cap">Info</span></div>
  <div class="ds-col"><span class="badge badge--success"><span class="badge__dot"></span>Successo</span><span class="ds-cap">Successo</span></div>
  <div class="ds-col"><span class="badge badge--warning"><span class="badge__dot"></span>Avviso</span><span class="ds-cap">Avviso</span></div>
  <div class="ds-col"><span class="badge badge--error"><span class="badge__dot"></span>Errore</span><span class="ds-cap">Errore</span></div>
</div>
```

| Tone | Use it for |
| --- | --- |
| Neutro | Genre, category, anything without a status. The default. |
| Rosa, Lime | Brand highlights such as "Nuovo" or "Live". Use sparingly: one highlighted badge per card. |
| Info, Successo, Avviso, Errore | Status that has a meaning (available, almost full, cancelled). |

Compact size, for dense lists and table cells:

```html preview
<div class="ds-stage">
  <span class="badge"><span class="badge__dot"></span>Default</span>
  <span class="badge badge--compact"><span class="badge__dot"></span>Compatto</span>
  <span class="badge badge--compact badge--pink">Senza pallino</span>
</div>
```

## States

A badge is static: it has no hover, focus or disabled state. If the item it labels is disabled, the badge stays as it is. The only option is the dot, which can be removed when space is tight, as long as the label alone still carries the meaning.

```html preview
<div class="ds-stage">
  <div class="ds-col"><span class="badge badge--success"><span class="badge__dot"></span>Posti liberi</span><span class="ds-cap">Con pallino</span></div>
  <div class="ds-col"><span class="badge badge--success">Posti liberi</span><span class="ds-cap">Senza pallino</span></div>
</div>
```

## Usage

> [!DO]
> Keep the label to one or two words and write the same word the same way everywhere. Use the tinted tones (Successo, Avviso, Errore) for status, because they come with a border and a dot, not only a colour.

> [!DONT]
> Don't use a badge as a button, a filter chip or a link. People will try to click it and nothing happens.

> [!DO]
> Put badges in the same place on every card, usually above the title, so people learn where to look.

> [!DONT]
> Don't stack three or more badges on one item, and don't use Rosa or Lime for status: those two are brand colours, not signals.

## Code

```html component preview title="badge.html"
<style>
  .badge {
    --badge-bg: var(--surface-page-secondary);
    --badge-fg: var(--text-default-body);
    --badge-border: transparent;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-inline-xs);
    padding: var(--spacing-tag-badge-inset-vertical) var(--spacing-tag-badge-inset-horizontal);
    border: var(--border-width-sm) solid var(--badge-border);
    border-radius: var(--radius-full);
    background: var(--badge-bg);
    color: var(--badge-fg);
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
    font-size: var(--font-ui-label-font-size);
    line-height: var(--font-ui-label-line-height);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .badge__dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    background: currentColor;
  }
  .badge--compact { padding-block: var(--spacing-tag-badge-inset-vertical-compact); }
  .badge--pink { --badge-bg: var(--surface-primary-default); --badge-fg: var(--text-primary-default-on-colour); }
  .badge--lime { --badge-bg: var(--surface-accent-default); --badge-fg: var(--text-accent-default-on-colour); }
  .badge--info { --badge-bg: var(--surface-information-default-subtle); --badge-border: var(--border-information-default); --badge-fg: var(--text-information-default); }
  .badge--success { --badge-bg: var(--surface-success-default-subtle); --badge-border: var(--border-success-default); --badge-fg: var(--text-success-default); }
  .badge--warning { --badge-bg: var(--surface-warning-default-subtle); --badge-border: var(--border-warning-default); --badge-fg: var(--text-warning-default); }
  .badge--error { --badge-bg: var(--surface-error-default-subtle); --badge-border: var(--border-error-default); --badge-fg: var(--text-error-default); }
</style>
<span class="badge badge--lime"><span class="badge__dot" aria-hidden="true"></span>Live</span>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `badge--pink`, `badge--lime`, `badge--info`, `badge--success`, `badge--warning`, `badge--error` | neutral | Tone. No modifier gives the neutral badge. |
| `badge--compact` | class | – | Smaller vertical padding (20px high instead of 24px). |
| `.badge__dot` | element | – | Optional dot. Add `aria-hidden="true"`. |

## Design tokens

```tokens
used: code
match: badge
```

## Accessibility

- **Not interactive.** A badge is plain text in a `<span>`: it takes no focus and has no role.
- **Meaning without colour.** The label must say the status by itself ("Sold out"). The dot and the colour only reinforce it.
- **Contrast.** Tinted tones use the dark text token on a light surface; Rosa and Lime use the on-colour text tokens. All reach 4.5:1.
- **Screen readers.** If the badge changes dynamically (a count, "Live" appearing), put it in a region with `aria-live="polite"`. Otherwise it is read in order with the item it labels.
- **Uppercase.** The uppercase comes from CSS (`text-transform`), so screen readers read the text as written.

## Figma

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=153-19659

## Changelog

- `2026-11-11`: Page filled from the Figma library: tones, sizes, dot option, usage, HTML code with tokens and accessibility.
