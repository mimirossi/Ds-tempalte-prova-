---
title: Radio group
group: Forms
order: 30
type: component
status: Draft
description: A group of options where exactly one can be chosen.
figma: https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=157-19738
---

## Overview

A radio group asks people to pick **one** option from a short list, with every option visible at once: the kind of ticket, the day of the live, how to be contacted. Seeing all options together makes the comparison easy.

Use it for two to five options. With more, use a [select](#/components/select). If several options can be chosen at once, use [checkbox](#/components/checkbox). Always preselect the most likely option, unless the choice is a consent.

```html preview
<div class="ds-stack">
  <fieldset class="radio-group">
    <legend class="radio-group__legend">Quando vieni?</legend>
    <label class="radio"><input class="radio__input" type="radio" name="ex-g" checked><span class="radio__disc"></span><span class="radio__label">Giovedì</span></label>
    <label class="radio"><input class="radio__input" type="radio" name="ex-g"><span class="radio__disc"></span><span class="radio__label">Sabato</span></label>
    <label class="radio"><input class="radio__input" type="radio" name="ex-g"><span class="radio__disc"></span><span class="radio__label">Tutte e due</span></label>
  </fieldset>
</div>
```

## Anatomy

```html preview
<div class="ds-stage">
  <span class="ds-anat" style="width: 260px;">
    <fieldset class="radio-group">
      <legend class="radio-group__legend">Quando vieni?</legend>
      <label class="radio"><input class="radio__input" type="radio" name="an-g" checked><span class="radio__disc"></span><span class="radio__label">Giovedì</span></label>
      <label class="radio"><input class="radio__input" type="radio" name="an-g"><span class="radio__disc"></span><span class="radio__label">Sabato</span></label>
    </fieldset>
    <span class="ds-pin" style="top:-4px;left:-30px">1</span>
    <span class="ds-pin" style="top:36px;left:-30px">2</span>
    <span class="ds-pin" style="top:36px;left:60px">3</span>
    <span class="ds-pin" style="top:36px;right:-30px">4</span>
  </span>
</div>
```

1. **Legend.** The question, above the options. It names the group for screen readers.
2. **Disc.** 24px circle, 1px border. Selected: primary surface with a 10px dot in the page colour.
3. **Label.** The option text, clickable with the disc.
4. **Row.** 48px high, `--radius-md`: hover and focus surround the whole row.

## Variants

There are two components: the single **radio** and the **group** that stacks them with a legend and an optional error. Options stack vertically; use the horizontal layout only for two short options.

```html preview
<div class="ds-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); align-items: start;">
  <fieldset class="radio-group">
    <legend class="radio-group__legend">Verticale</legend>
    <label class="radio"><input class="radio__input" type="radio" name="v1" checked><span class="radio__disc"></span><span class="radio__label">Biglietto intero</span></label>
    <label class="radio"><input class="radio__input" type="radio" name="v1"><span class="radio__disc"></span><span class="radio__label">Ridotto</span></label>
    <label class="radio"><input class="radio__input" type="radio" name="v1"><span class="radio__disc"></span><span class="radio__label">Lista ospiti</span></label>
  </fieldset>
  <fieldset class="radio-group radio-group--inline">
    <legend class="radio-group__legend">Orizzontale</legend>
    <label class="radio"><input class="radio__input" type="radio" name="v2" checked><span class="radio__disc"></span><span class="radio__label">Sì</span></label>
    <label class="radio"><input class="radio__input" type="radio" name="v2"><span class="radio__disc"></span><span class="radio__label">No</span></label>
  </fieldset>
</div>
```

## States

Default, hover, focus, disabled and error, selected or not.

```html preview
<div class="ds-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
  <label class="radio"><input class="radio__input" type="radio" name="s1" tabindex="-1"><span class="radio__disc"></span><span class="radio__label">Default</span></label>
  <label class="radio is-hover"><input class="radio__input" type="radio" name="s2" tabindex="-1"><span class="radio__disc"></span><span class="radio__label">Hover</span></label>
  <label class="radio is-focus"><input class="radio__input" type="radio" name="s3" tabindex="-1"><span class="radio__disc"></span><span class="radio__label">Focus</span></label>
  <label class="radio"><input class="radio__input" type="radio" name="s4" disabled><span class="radio__disc"></span><span class="radio__label">Disabilitato</span></label>
  <label class="radio"><input class="radio__input" type="radio" name="s5" checked tabindex="-1"><span class="radio__disc"></span><span class="radio__label">Default</span></label>
  <label class="radio is-hover"><input class="radio__input" type="radio" name="s6" checked tabindex="-1"><span class="radio__disc"></span><span class="radio__label">Hover</span></label>
  <label class="radio is-focus"><input class="radio__input" type="radio" name="s7" checked tabindex="-1"><span class="radio__disc"></span><span class="radio__label">Focus</span></label>
  <label class="radio"><input class="radio__input" type="radio" name="s8" checked disabled><span class="radio__disc"></span><span class="radio__label">Disabilitato</span></label>
</div>
```

```html preview
<div class="ds-stack">
  <fieldset class="radio-group radio-group--error">
    <legend class="radio-group__legend">Come vuoi la conferma?</legend>
    <label class="radio"><input class="radio__input" type="radio" name="er" aria-invalid="true"><span class="radio__disc"></span><span class="radio__label">Email</span></label>
    <label class="radio"><input class="radio__input" type="radio" name="er" aria-invalid="true"><span class="radio__disc"></span><span class="radio__label">WhatsApp</span></label>
    <p class="radio-group__error">Scegli un modo per ricevere la conferma.</p>
  </fieldset>
</div>
```

## Usage

> [!DO]
> Keep the list short (two to five options), write labels that differ in the first word, and preselect the safest or most common choice.

> [!DONT]
> Don't use a radio group for more than five options or for a choice that can be several. Don't leave all options empty when one is clearly the default.

> [!DO]
> Put the question in the legend and let the whole row be clickable. Use the arrow keys to move inside the group.

> [!DONT]
> Don't put other controls (inputs, links) inside an option row, and don't switch the page layout when a radio is chosen without announcing it.

## Code

```html component preview title="radio-group.html"
<style>
  .radio-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-stack-2xs);
    margin: 0;
    padding: 0;
    border: 0;
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
  }
  .radio-group--inline { flex-direction: row; flex-wrap: wrap; }
  .radio-group__legend {
    padding: 0 0 var(--spacing-stack-xs);
    color: var(--text-default-heading);
    font-size: var(--font-ui-label-font-size);
    line-height: var(--font-ui-label-line-height);
    font-weight: 600;
  }
  .radio-group--inline .radio-group__legend { width: 100%; }
  .radio-group__error {
    margin: 0;
    color: var(--text-error-default);
    font-size: var(--font-caption-font-size);
    line-height: var(--font-caption-line-height);
  }
  .radio {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--spacing-inline-md);
    min-height: 48px;
    padding: var(--spacing-inset-sm-plus) var(--spacing-inset-sm);
    border-radius: var(--radius-md);
    cursor: pointer;
  }
  .radio__input { position: absolute; opacity: 0; width: 24px; height: 24px; margin: 0; }
  .radio__disc {
    position: relative;
    flex: none;
    width: 24px;
    height: 24px;
    box-sizing: border-box;
    border: var(--border-width-sm) solid var(--border-default-default);
    border-radius: var(--radius-full);
    background: var(--surface-default);
  }
  .radio__label {
    color: var(--text-default-body);
    font-size: var(--font-body-default-font-size);
    line-height: var(--font-body-default-line-height);
  }
  .radio:hover .radio__disc,
  .radio.is-hover .radio__disc {
    border-color: var(--border-primary-default);
    background: var(--surface-primary-default-subtle);
  }
  .radio__input:checked + .radio__disc {
    background: var(--surface-primary-default);
    border-color: var(--border-primary-default);
  }
  .radio__input:checked + .radio__disc::after {
    content: "";
    position: absolute;
    inset: 50% auto auto 50%;
    width: 10px;
    height: 10px;
    transform: translate(-50%, -50%);
    border-radius: var(--radius-full);
    background: var(--surface-page);
  }
  .radio:hover .radio__input:checked + .radio__disc,
  .radio.is-hover .radio__input:checked + .radio__disc { background: var(--surface-primary-default-hover); }
  .radio:has(.radio__input:focus-visible),
  .radio.is-focus { outline: var(--border-width-md) solid var(--border-primary-focus); }
  .radio-group--error .radio__disc { border-color: var(--border-error-default); }
  .radio:has(.radio__input:disabled) { cursor: not-allowed; }
  .radio__input:disabled + .radio__disc {
    background: var(--surface-disabled-default-subtle);
    border-color: var(--border-disabled-default);
  }
  .radio__input:disabled:checked + .radio__disc { background: var(--surface-disabled-default); }
  .radio__input:disabled ~ .radio__label { color: var(--text-disabled-default); }
</style>
<fieldset class="radio-group">
  <legend class="radio-group__legend">Quando vieni?</legend>
  <label class="radio"><input class="radio__input" type="radio" name="giorno" value="gio" checked><span class="radio__disc" aria-hidden="true"></span><span class="radio__label">Giovedì</span></label>
  <label class="radio"><input class="radio__input" type="radio" name="giorno" value="sab"><span class="radio__disc" aria-hidden="true"></span><span class="radio__label">Sabato</span></label>
</fieldset>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | – | Same name on every radio of the group. Required. |
| `checked` | attribute | – | The preselected option. Only one per group. |
| `radio-group--inline` | class | – | Lays the options in a row. Use for two short options. |
| `radio-group--error` | class | – | Error border on the discs. Show `.radio-group__error` and set `aria-invalid="true"`. |
| `disabled` | attribute | – | Disables one option or the whole `<fieldset>`. |

## Design tokens

```tokens
used: code
match: radio
```

## Accessibility

- **Native radios in a fieldset.** `<fieldset>` + `<legend>` gives the group its name; the browser handles selection.
- **Keyboard.** Tab enters the group on the selected option, arrow keys move and select, Space selects. The group is one tab stop.
- **Focus.** A 2px ring in `--border-primary-focus` around the row.
- **Target size.** Rows are 48px high.
- **Errors.** Show the message under the group, link it with `aria-describedby` on the fieldset and move the focus to the first option.
- **Don't change on arrow keys.** If selecting an option loads other content, announce it with a live region.

## Figma

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=157-19738

## Changelog

- `2026-11-11`: Page filled from the Figma library: radio and group, layouts, states, usage, HTML code with tokens, props and accessibility.
