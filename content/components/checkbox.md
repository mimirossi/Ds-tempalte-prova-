---
title: Checkbox
group: Forms
order: 20
type: component
status: Draft
description: A control to turn one option on or off, or to select several options in a list.
figma: https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=155-19752
---

## Overview

A checkbox lets people choose an option **independently** of the others: accept a rule, join a newsletter, pick several genres. The whole row is the target (48px high), not only the box.

Use a checkbox when several options can be on at the same time, or for a single yes/no that is saved on submit. When only one choice is allowed use [radio group](#/components/radio-group); when the change must be immediate, like a setting, use a switch.

```html preview
<div class="ds-stack">
  <label class="checkbox"><input type="checkbox" class="checkbox__input" checked><span class="checkbox__box"></span><span class="checkbox__text"><span class="checkbox__label">Ricevi le date dei live</span><span class="checkbox__hint">Una mail al mese, niente altro.</span></span></label>
  <label class="checkbox"><input type="checkbox" class="checkbox__input"><span class="checkbox__box"></span><span class="checkbox__text"><span class="checkbox__label">Porto un amico</span></span></label>
</div>
```

## Anatomy

```html preview
<div class="ds-stage">
  <span class="ds-anat" style="width: 300px;">
    <label class="checkbox"><input type="checkbox" class="checkbox__input" checked><span class="checkbox__box"></span><span class="checkbox__text"><span class="checkbox__label">Ricevi le date dei live</span><span class="checkbox__hint">Una mail al mese, niente altro.</span></span></label>
    <span class="ds-pin" style="top:-18px;left:-4px">1</span>
    <span class="ds-pin" style="top:-18px;left:36px">2</span>
    <span class="ds-pin" style="bottom:-18px;left:36px">3</span>
    <span class="ds-pin" style="top:10px;right:-30px">4</span>
  </span>
</div>
```

1. **Box.** 24px square, `--radius-sm`, 1px border. When on it is filled with the primary surface and shows a check; when mixed, a dash.
2. **Label.** What turns on, written as a statement: "Ricevi le date dei live".
3. **Hint (optional).** One line of explanation in the caption style.
4. **Row.** 48px high with `--radius-md`: the focus ring and the hover surround the whole row.

## Variants

Three values. The indeterminate value is for a parent that controls a list of children.

```html preview
<div class="ds-stage">
  <div class="ds-col"><label class="checkbox"><input type="checkbox" class="checkbox__input"><span class="checkbox__box"></span><span class="checkbox__text"><span class="checkbox__label">Non selezionato</span></span></label></div>
  <div class="ds-col"><label class="checkbox"><input type="checkbox" class="checkbox__input" checked><span class="checkbox__box"></span><span class="checkbox__text"><span class="checkbox__label">Selezionato</span></span></label></div>
  <div class="ds-col"><label class="checkbox"><input type="checkbox" class="checkbox__input is-mixed"><span class="checkbox__box"></span><span class="checkbox__text"><span class="checkbox__label">Indeterminato</span></span></label></div>
</div>
```

## States

Default, hover, focus, disabled and error, in every value.

```html preview
<div class="ds-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
  <label class="checkbox"><input type="checkbox" class="checkbox__input" tabindex="-1"><span class="checkbox__box"></span><span class="checkbox__text"><span class="checkbox__label">Default</span></span></label>
  <label class="checkbox is-hover"><input type="checkbox" class="checkbox__input" checked tabindex="-1"><span class="checkbox__box"></span><span class="checkbox__text"><span class="checkbox__label">Hover</span></span></label>
  <label class="checkbox is-focus"><input type="checkbox" class="checkbox__input" tabindex="-1"><span class="checkbox__box"></span><span class="checkbox__text"><span class="checkbox__label">Focus</span></span></label>
  <label class="checkbox"><input type="checkbox" class="checkbox__input" checked disabled><span class="checkbox__box"></span><span class="checkbox__text"><span class="checkbox__label">Disabilitato</span></span></label>
  <label class="checkbox"><input type="checkbox" class="checkbox__input is-mixed" tabindex="-1"><span class="checkbox__box"></span><span class="checkbox__text"><span class="checkbox__label">Indeterminato</span></span></label>
  <label class="checkbox checkbox--error"><input type="checkbox" class="checkbox__input" aria-invalid="true" tabindex="-1"><span class="checkbox__box"></span><span class="checkbox__text"><span class="checkbox__label">Accetto le regole del locale</span><span class="checkbox__error">Devi accettare per prenotare.</span></span></label>
</div>
```

## Usage

> [!DO]
> Write the label as a positive statement ("Ricevi le date dei live") and make the whole row clickable. Leave every option **unchecked** by default, especially for marketing consent.

> [!DONT]
> Don't use a checkbox for a choice among exclusive options, and don't pre-check a box that gives permission. Don't write negative labels like "Non voglio ricevere…".

> [!DO]
> Show the error under the label and link it to the input, then move the focus to the first box with an error.

> [!DONT]
> Don't change the page the moment a box is clicked without telling people. If the effect is immediate, use a switch.

## Code

```html component preview title="checkbox.html"
<style>
  .checkbox {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-inline-md);
    min-height: 48px;
    padding: var(--spacing-inset-sm-plus) var(--spacing-inset-sm);
    border-radius: var(--radius-md);
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
    cursor: pointer;
  }
  .checkbox__input {
    position: absolute;
    opacity: 0;
    width: 24px;
    height: 24px;
    margin: 0;
  }
  .checkbox__box {
    position: relative;
    flex: none;
    width: 24px;
    height: 24px;
    box-sizing: border-box;
    border: var(--border-width-sm) solid var(--border-default-default);
    border-radius: var(--radius-sm);
    background: var(--surface-default);
  }
  .checkbox__text { display: flex; flex-direction: column; }
  .checkbox__label {
    color: var(--text-default-body);
    font-size: var(--font-body-default-font-size);
    line-height: var(--font-body-default-line-height);
  }
  .checkbox__hint,
  .checkbox__error {
    font-size: var(--font-caption-font-size);
    line-height: var(--font-caption-line-height);
    color: var(--text-default-caption);
  }
  .checkbox__error { color: var(--text-error-default); }
  .checkbox:hover .checkbox__box,
  .checkbox.is-hover .checkbox__box { border-color: var(--border-primary-default); }
  .checkbox__input:checked + .checkbox__box,
  .checkbox__input.is-mixed + .checkbox__box {
    background: var(--surface-primary-default);
    border-color: var(--border-primary-default);
  }
  .checkbox:hover .checkbox__input:checked + .checkbox__box,
  .checkbox.is-hover .checkbox__input:checked + .checkbox__box { background: var(--surface-primary-default-hover); }
  .checkbox__input:checked + .checkbox__box::after {
    content: "";
    position: absolute;
    left: 7px; top: 3px;
    width: 6px; height: 11px;
    border: solid var(--text-primary-default-on-colour);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  .checkbox__input.is-mixed + .checkbox__box::after {
    content: "";
    position: absolute;
    left: 5px; top: 10px;
    width: 12px; height: 2px;
    background: var(--text-primary-default-on-colour);
  }
  .checkbox:has(.checkbox__input:focus-visible),
  .checkbox.is-focus {
    outline: var(--border-width-md) solid var(--border-primary-focus);
    outline-offset: 0;
  }
  .checkbox--error .checkbox__box { border-color: var(--border-error-default); }
  .checkbox:has(.checkbox__input:disabled) { cursor: not-allowed; }
  .checkbox__input:disabled + .checkbox__box {
    background: var(--surface-disabled-default);
    border-color: var(--border-disabled-default);
  }
  .checkbox__input:disabled ~ .checkbox__text .checkbox__label { color: var(--text-disabled-default); }
</style>
<label class="checkbox">
  <input class="checkbox__input" type="checkbox" name="live" checked>
  <span class="checkbox__box" aria-hidden="true"></span>
  <span class="checkbox__text">
    <span class="checkbox__label">Ricevi le date dei live</span>
    <span class="checkbox__hint">Una mail al mese, niente altro.</span>
  </span>
</label>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | attribute | off | Selected value. Never pre-check consent. |
| `is-mixed` | class | – | Indeterminate value. Also set `input.indeterminate = true` in JavaScript. |
| `disabled` | attribute | – | Disables the control and greys the label. |
| `checkbox--error` | class | – | Error border on the box. Add `aria-invalid="true"` and show `.checkbox__error`. |
| `name`, `value` | attribute | – | Native form fields. Use one name per group. |

## Design tokens

```tokens
used: code
match: checkbox
```

## Accessibility

- **Native input.** Use a real `<input type="checkbox">` inside a `<label>`: keyboard, screen readers and form submit work with no extra code.
- **Keyboard.** Tab to reach, Space to toggle. In a group, wrap the boxes in `<fieldset>` with a `<legend>`.
- **Focus.** A 2px ring around the whole row in `--border-primary-focus`.
- **Target size.** The row is 48px high, above the 44px minimum.
- **Mixed value.** Set `indeterminate` in JavaScript so assistive technology announces "mixed".
- **Errors.** Don't rely on the red border: show the message and link it with `aria-describedby`.

## Figma

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=155-19752

## Changelog

- `2026-11-11`: Page filled from the Figma library: three values, six states, usage, HTML code with tokens, props and accessibility.
