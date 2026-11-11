---
title: Select
group: Forms
order: 40
type: component
status: Draft
description: A field that opens a list of options and lets people choose one.
figma: https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=159-19781
---

## Overview

A select shows a list of options on request and keeps one chosen. It takes the room of a single field, so it fits a long list (a city, a country, a month) where a radio group would take the whole screen.

Use it for **six or more** options of which one is picked. For fewer, a [radio group](#/components/radio-group) is faster because everything is visible. For a list people can search or that is very long, add a search field above the list.

```html preview
<div class="ds-stack">
  <div class="field">
    <label class="field__label" for="ex-citta">Città</label>
    <p class="field__message">Dove vuoi ascoltare il prossimo set.</p>
    <div class="select"><select class="select__control" id="ex-citta"><option value="">Scegli una città</option><option>Bari</option><option>Milano</option><option>Roma</option><option>Napoli</option></select></div>
  </div>
</div>
```

## Anatomy

```html preview
<div class="ds-stage">
  <span class="ds-anat" style="width: 320px;">
    <div class="field">
      <label class="field__label" for="an-citta">Città</label>
      <p class="field__message">Dove vuoi ascoltare il prossimo set.</p>
      <div class="select"><select class="select__control" id="an-citta"><option>Bari</option></select></div>
    </div>
    <span class="ds-pin" style="top:-8px;left:-30px">1</span>
    <span class="ds-pin" style="top:26px;left:-30px">2</span>
    <span class="ds-pin" style="top:58px;left:-30px">3</span>
    <span class="ds-pin" style="top:62px;right:-30px">4</span>
  </span>
</div>
```

1. **Label.** Always visible, above the field.
2. **Message.** One line above the field: hint, error or success.
3. **Field.** Same 44px field as the [input](#/components/input), with the current value or a placeholder.
4. **Chevron.** 20px icon that shows the list is closed (down) or open (up).

The open list is a panel under the field with the option rows below.

## Variants

The select has one size. The **option** inside the list has its own four states:

```html preview
<div class="ds-stack" style="max-width: 340px;">
  <div class="select-list" role="listbox" aria-label="Esempio di stati dell'opzione">
    <div class="select-option" role="option" aria-selected="false">Default · Bari</div>
    <div class="select-option is-hover" role="option" aria-selected="false">Hover · Milano</div>
    <div class="select-option is-selected" role="option" aria-selected="true">Selezionata · Roma</div>
    <div class="select-option is-disabled" role="option" aria-disabled="true">Disabilitata · Napoli</div>
  </div>
</div>
```

## States

```html preview
<div class="ds-grid" style="grid-template-columns: repeat(3, 280px); align-items: start;">
  <div class="field"><label class="field__label">Default</label><p class="field__message">Messaggio di aiuto</p><div class="select"><select class="select__control" tabindex="-1"><option>Scegli una città</option></select></div></div>
  <div class="field"><label class="field__label">Hover</label><p class="field__message">Messaggio di aiuto</p><div class="select"><select class="select__control is-hover" tabindex="-1"><option>Scegli una città</option></select></div></div>
  <div class="field"><label class="field__label">Focus</label><p class="field__message">Messaggio di aiuto</p><div class="select"><select class="select__control is-focus" tabindex="-1"><option>Scegli una città</option></select></div></div>
  <div class="field"><label class="field__label">Compilato</label><p class="field__message">Messaggio di aiuto</p><div class="select"><select class="select__control" tabindex="-1"><option>Bari</option></select></div></div>
  <div class="field field--error"><label class="field__label">Errore</label><p class="field__message">Scegli una città.</p><div class="select"><select class="select__control" aria-invalid="true" tabindex="-1"><option>Scegli una città</option></select></div></div>
  <div class="field"><label class="field__label" style="color: var(--text-disabled-default)">Disabilitato</label><p class="field__message">Messaggio di aiuto</p><div class="select"><select class="select__control" disabled><option>Non disponibile</option></select></div></div>
</div>
```

State **Aperto**: field with focus ring and the list underneath.

```html preview
<div class="ds-stack" style="max-width: 340px; min-height: 260px;">
  <div class="field">
    <label class="field__label">Città</label>
    <p class="field__message">Dove vuoi ascoltare il prossimo set.</p>
    <div class="select is-open">
      <div class="select__control is-focus" role="combobox" aria-expanded="true" aria-haspopup="listbox">Roma</div>
      <div class="select-list" role="listbox">
        <div class="select-option" role="option">Bari</div>
        <div class="select-option is-hover" role="option">Milano</div>
        <div class="select-option is-selected" role="option" aria-selected="true">Roma</div>
        <div class="select-option is-disabled" role="option" aria-disabled="true">Napoli</div>
      </div>
    </div>
  </div>
</div>
```

## Usage

> [!DO]
> Start from the native `<select>`: it opens the right list on mobile, works with the keyboard and is announced by screen readers. Style the closed field, and style the list only when you really need to.

> [!DONT]
> Don't use a select for two or three options, and don't use a placeholder option as the only label. Don't build a custom list without the full keyboard behaviour.

> [!DO]
> Sort the options in an order people expect (alphabetical, by date, most common first) and say "Scegli…" in the placeholder.

> [!DONT]
> Don't put actions ("Aggiungi nuova città") inside the list among the options, and don't auto-submit the page when an option is chosen.

## Code

```html component preview title="select.html"
<style>
  .field { display: flex; flex-direction: column; gap: var(--spacing-input-label-field); width: 100%; font-family: "Bricolage Grotesque", system-ui, sans-serif; }
  .field__label { color: var(--text-default-body); font-size: var(--font-ui-label-font-size); line-height: var(--font-ui-label-line-height); font-weight: 600; }
  .field__message { margin: 0; color: var(--text-default-caption); font-size: var(--font-caption-font-size); line-height: var(--font-caption-line-height); }
  .field--error .field__message { color: var(--text-error-default); }
  .select { position: relative; }
  .select__control {
    appearance: none;
    box-sizing: border-box;
    width: 100%;
    min-height: 44px;
    padding: var(--spacing-input-inset-vertical) calc(var(--spacing-input-inset-horizontal) + 28px) var(--spacing-input-inset-vertical) var(--spacing-input-inset-horizontal);
    border: var(--border-width-sm) solid var(--border-default-default);
    border-radius: var(--radius-md);
    background: var(--surface-default) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M5 8l5 5 5-5' fill='none' stroke='%231c1c1c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right var(--spacing-input-inset-horizontal) center;
    color: var(--text-default-body);
    font: inherit;
    font-size: var(--font-ui-input-font-size);
    line-height: var(--font-ui-input-line-height);
    cursor: pointer;
  }
  .select__control:hover, .select__control.is-hover { border-color: var(--border-primary-default); }
  .select__control:focus-visible, .select__control.is-focus { outline: none; border: var(--border-width-md) solid var(--border-primary-focus); }
  .field--error .select__control { border: var(--border-width-md) solid var(--border-error-default); }
  .select__control:disabled { border-color: var(--border-disabled-default); background-color: var(--surface-disabled-default-subtle); color: var(--text-disabled-default); cursor: not-allowed; }
  .select.is-open .select__control { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M5 12l5-5 5 5' fill='none' stroke='%231c1c1c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); }
  .select-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-stack-2xs);
    margin-top: var(--spacing-stack-xs);
    padding: var(--spacing-inset-xs);
    border: var(--border-width-sm) solid var(--border-default-default);
    border-radius: var(--radius-md);
    background: var(--surface-default);
    box-shadow: var(--elevation-md-offset-x) var(--elevation-md-offset-y) var(--elevation-md-blur) var(--elevation-md-spread) var(--elevation-md-color);
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
  }
  .select-option {
    min-height: 44px;
    box-sizing: border-box;
    padding: var(--spacing-input-inset-vertical) var(--spacing-input-inset-horizontal);
    border-radius: var(--radius-sm);
    color: var(--text-default-body);
    font-size: var(--font-ui-input-font-size);
    line-height: var(--font-ui-input-line-height);
    cursor: pointer;
  }
  .select-option:hover, .select-option.is-hover { background: var(--surface-page-secondary); }
  .select-option.is-selected { background: var(--surface-primary-default-subtle); }
  .select-option.is-disabled { color: var(--text-disabled-default); opacity: 0.5; cursor: not-allowed; }
</style>
<div class="field">
  <label class="field__label" for="citta">Città</label>
  <p class="field__message" id="citta-msg">Dove vuoi ascoltare il prossimo set.</p>
  <div class="select">
    <select class="select__control" id="citta" name="citta" aria-describedby="citta-msg">
      <option value="">Scegli una città</option>
      <option>Bari</option>
      <option>Milano</option>
      <option>Roma</option>
    </select>
  </div>
</div>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name`, `id` | string | – | Native form fields. Link the `<label for>` to the `id`. |
| `required` | attribute | – | Marks the field as required and enables browser validation. |
| `disabled` | attribute | – | Disables the field. |
| `aria-invalid` | `true` | – | Set it together with `field--error` and show the message. |
| `select__control` | class | – | Closed field. On a custom combobox, add `role="combobox"`, `aria-expanded`. |
| `select-option` | class | – | Row in a custom list. States: `is-hover`, `is-selected`, `is-disabled`. |

## Design tokens

```tokens
used: code
match: select
```

## Accessibility

- **Native first.** A real `<select>` is announced as a list, opens the system picker on mobile and works with type-ahead.
- **Custom list.** If you build the open list yourself, use `role="combobox"` on the field and `role="listbox"` / `role="option"` on the list, with `aria-expanded`, `aria-activedescendant` and arrow-key, Home, End, Enter and Esc handling.
- **Focus.** A 2px ring in `--border-primary-focus` on the field; the focus stays on the field while the list is open.
- **Target size.** Field and options are 44px high.
- **Disabled option.** Dimmed to 50% **and** marked with `aria-disabled`; never rely on the colour alone.
- **Errors.** Same rules as the input: message above the field, `aria-describedby`, `aria-invalid`.

## Figma

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=159-19781

## Changelog

- `2026-11-11`: Page filled from the Figma library: field and option, seven states, open state, usage, HTML code with tokens, props and accessibility.
