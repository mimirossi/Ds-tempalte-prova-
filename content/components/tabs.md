---
title: Tabs
group: Navigation
order: 10
type: component
status: Draft
description: A group of tabs that switches between views of the same content without leaving the page.
figma: https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=166-19649
---

## Overview

Tabs let people switch between **alternative views of the same subject**: the Set, the Mix and the Date of an artist, for example. One tab is always selected and the panel under it changes at once, without changing the page address.

Use tabs when the views are of equal weight and people usually need only one at a time. If the views are different pages, or the order matters, use the navigation menu or a stepper. Keep two to five tabs with one- or two-word labels.

```html preview
<div class="ds-stack">
  <div class="tabs" role="tablist" aria-label="Sezioni">
  <button class="tab" role="tab" id="t0" aria-selected="true" aria-controls="p0" tabindex="0" type="button">Set</button>
  <button class="tab" role="tab" id="t1" aria-selected="false" aria-controls="p1" tabindex="-1" type="button">Mix</button>
  <button class="tab" role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1" type="button">Date</button>
</div>
  <div class="tabpanel" role="tabpanel" id="p0" aria-labelledby="t0">
    <h3 class="tabpanel__title">Set</h3>
    <p class="tabpanel__text">Selezioni registrate dal vivo: house, percussioni e quel tocco latino che arriva prima dei pensieri.</p>
  </div>
</div>
```

## Anatomy

```html preview
<div class="ds-stage">
  <span class="ds-anat" style="margin: 36px 50px;">
    <div class="tabs" role="tablist" aria-label="Sezioni">
  <button class="tab" role="tab" id="t0" aria-selected="true" aria-controls="p0" tabindex="0" type="button">Set</button>
  <button class="tab" role="tab" id="t1" aria-selected="false" aria-controls="p1" tabindex="-1" type="button">Mix</button>
  <button class="tab" role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1" type="button">Date</button>
</div>
    <span class="ds-pin" style="top:-28px;left:-4px">1</span>
    <span class="ds-pin" style="top:-28px;left:12px">2</span>
    <span class="ds-pin" style="top:-28px;left:90px">3</span>
  </span>
</div>
```

1. **Tab list.** A pill with a light surface and 4px padding that holds the tabs.
2. **Selected tab.** Filled with the primary surface; the text colour changes as well.
3. **Other tabs.** No fill at rest, a light grey on hover. 44px high, pill shape, `font/ui/button`.

Under the list there is the **panel** with the content of the selected tab.

## Variants

One group, from two to five tabs. The selected tab can be any of them; the first one is the default.

```html preview
<div class="ds-grid" style="grid-template-columns: 1fr;">
  <div class="tabs" role="tablist" aria-label="Sezioni">
  <button class="tab" role="tab" id="t0" aria-selected="true" aria-controls="p0" tabindex="0" type="button">Set</button>
  <button class="tab" role="tab" id="t1" aria-selected="false" aria-controls="p1" tabindex="-1" type="button">Mix</button>
  <button class="tab" role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1" type="button">Date</button>
</div>
  <div class="tabs" role="tablist" aria-label="Sezioni">
  <button class="tab" role="tab" id="t0" aria-selected="false" aria-controls="p0" tabindex="-1" type="button">Set</button>
  <button class="tab" role="tab" id="t1" aria-selected="true" aria-controls="p1" tabindex="0" type="button">Mix</button>
  <button class="tab" role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1" type="button">Date</button>
</div>
  <div class="tabs" role="tablist" aria-label="Sezioni">
  <button class="tab" role="tab" id="t0" aria-selected="false" aria-controls="p0" tabindex="-1" type="button">Set</button>
  <button class="tab" role="tab" id="t1" aria-selected="false" aria-controls="p1" tabindex="-1" type="button">Mix</button>
  <button class="tab" role="tab" id="t2" aria-selected="true" aria-controls="p2" tabindex="0" type="button">Date</button>
</div>
</div>
```

When the tabs don't fit the width (long labels, small screens), the list **scrolls horizontally** and the next tab is cut in the middle to show there is more. Don't wrap tabs on two lines.

## States

Five states for each tab: default, hover, selected, focus and disabled.

```html preview
<div class="ds-grid" style="grid-template-columns: repeat(5, auto); background: var(--surface-default); border-radius: var(--radius-lg);">
  <button class="tab" type="button" role="tab" aria-selected="false" tabindex="-1">Default</button>
  <button class="tab is-hover" type="button" role="tab" aria-selected="false" tabindex="-1">Hover</button>
  <button class="tab" type="button" role="tab" aria-selected="true">Selezionata</button>
  <button class="tab is-focus" type="button" role="tab" aria-selected="false" tabindex="-1">Focus</button>
  <button class="tab" type="button" role="tab" aria-selected="false" aria-disabled="true" disabled>Disabilitata</button>
</div>
```

## Usage

> [!DO]
> Use short nouns (Set, Mix, Date) that say what is inside. Keep the same order everywhere and select the first tab by default.

> [!DONT]
> Don't use tabs to move between pages or between steps of a process, and don't use them for content that people need to compare: it would be hidden.

> [!DO]
> Move between tabs with the arrow keys and show the panel as soon as the tab is selected.

> [!DONT]
> Don't disable a tab without saying why. If a view is not available, hide the tab. Don't put more than five tabs in the list.

## Code

```html component preview title="tabs.html"
<style>
  .tabs {
    display: inline-flex;
    gap: var(--spacing-inline-xs);
    max-width: 100%;
    padding: var(--spacing-inset-xs);
    overflow-x: auto;
    border-radius: var(--radius-full);
    background: var(--surface-default);
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
  }
  .tab {
    flex: none;
    min-height: 44px;
    padding: var(--spacing-inset-xs) var(--spacing-inset-lg);
    border: 0;
    border-radius: var(--radius-full);
    background: transparent;
    color: var(--text-default-body);
    font-family: inherit;
    font-size: var(--font-ui-button-font-size);
    line-height: var(--font-ui-button-line-height);
    font-weight: 500;
    cursor: pointer;
  }
  .tab:hover,
  .tab.is-hover { background: var(--surface-page-secondary); }
  .tab[aria-selected="true"] {
    background: var(--surface-primary-default);
    color: var(--text-on-colour-heading);
  }
  .tab:focus-visible,
  .tab.is-focus { outline: var(--border-width-md) solid var(--border-primary-focus); outline-offset: var(--border-width-md); }
  .tab:disabled { color: var(--text-disabled-default); opacity: 0.4; background: transparent; cursor: not-allowed; }
  .tabpanel {
    padding: var(--spacing-inset-lg);
    border-radius: var(--radius-lg);
    background: var(--surface-page);
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
  }
  .tabpanel[hidden] { display: none; }
  .tabpanel__title {
    margin: 0 0 var(--spacing-stack-sm);
    color: var(--text-default-heading);
    font-size: var(--font-heading-h4-font-size);
    line-height: var(--font-heading-h4-line-height);
    font-weight: 600;
  }
  .tabpanel__text { margin: 0; color: var(--text-default-body); font-size: var(--font-body-default-font-size); line-height: var(--font-body-default-line-height); }
</style>
<div class="tabs" role="tablist" aria-label="Sezioni">
  <button class="tab" role="tab" id="tab-set" aria-selected="true" aria-controls="panel-set" type="button">Set</button>
  <button class="tab" role="tab" id="tab-mix" aria-selected="false" aria-controls="panel-mix" tabindex="-1" type="button">Mix</button>
  <button class="tab" role="tab" id="tab-date" aria-selected="false" aria-controls="panel-date" tabindex="-1" type="button">Date</button>
</div>
<div class="tabpanel" role="tabpanel" id="panel-set" aria-labelledby="tab-set" tabindex="0">…</div>
<div class="tabpanel" role="tabpanel" id="panel-mix" aria-labelledby="tab-mix" tabindex="0" hidden>…</div>
<div class="tabpanel" role="tabpanel" id="panel-date" aria-labelledby="tab-date" tabindex="0" hidden>…</div>
```

```js title="tabs.js"
const tabs = [...document.querySelectorAll('[role="tab"]')];
function select(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
  tab.focus();
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => select(tab));
  tab.addEventListener("keydown", (e) => {
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next !== undefined) { e.preventDefault(); select(tabs[(next + tabs.length) % tabs.length]); }
  });
});
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `role="tablist"` | attribute | – | On the container. Add `aria-label` that names the group. |
| `role="tab"` | attribute | – | On each tab. `aria-selected="true"` on the active one, `aria-controls` points to its panel. |
| `role="tabpanel"` | attribute | – | On each panel, with `aria-labelledby` pointing to its tab. Hide inactive panels with `hidden`. |
| `tabindex` | `0`, `-1` | – | `0` only on the selected tab; the arrows move between tabs. |
| `disabled` | attribute | – | Disables a tab. Prefer hiding it. |
| `is-hover`, `is-focus` | class | – | Only to show a state in documentation. |

## Design tokens

```tokens
used: code
match: tab
```

## Accessibility

- **Roles.** `tablist`, `tab` and `tabpanel`, linked with `aria-controls` / `aria-labelledby`. Selected tab: `aria-selected="true"`.
- **Keyboard.** Tab enters the list on the selected tab and then leaves it. Left and Right arrows move between tabs, Home and End go to the first and last. The panel appears as soon as the tab is selected (automatic activation).
- **Focus.** A 2px ring in `--border-primary-focus` outside the tab, never hidden by the list.
- **Target size.** Each tab is at least 44px high and has a gap from the neighbours.
- **Selected state is not only colour.** The selected tab also has a filled surface and a different text colour.
- **Panels** are focusable (`tabindex="0"`) when they have no focusable content, so keyboard users can reach them.

## Figma

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=166-19649

## Changelog

- `2026-11-11`: Page filled from the Figma library: tab and tab group, five states, usage, HTML and JS code with tokens, props and accessibility.
