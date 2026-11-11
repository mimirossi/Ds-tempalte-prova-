---
title: Input
group: Forms
order: 10
type: component
status: Draft
description: A single-line text field with a label, an optional hint and validation messages.
figma: https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=154-19736
---

## Overview

An input collects a short piece of text: a name, an email, a city. The component is a label, a message line and a 44px field together, because a field without its label and its message is not usable.

Use it for a **single line** of free text. For a choice between a few options use [radio group](#/components/radio-group) or [select](#/components/select); for yes/no use [checkbox](#/components/checkbox). For long text use a textarea built on the same field style.

```html preview
<div class="ds-stack">
  <div class="field">
    <label class="field__label" for="ex-nome">Nome <span class="field__optional">Opzionale</span></label>
    <p class="field__message" id="ex-nome-msg">Come ti chiami sul biglietto.</p>
    <input class="field__control" id="ex-nome" type="text" placeholder="Es. Miriam" aria-describedby="ex-nome-msg">
  </div>
</div>
```

## Anatomy

```html preview
<div class="ds-stage">
  <span class="ds-anat" style="width: 320px;">
    <div class="field">
      <label class="field__label" for="an-email">Email</label>
      <p class="field__message" id="an-email-msg">Ti scriviamo la conferma qui.</p>
      <input class="field__control" id="an-email" type="email" placeholder="nome@email.it" aria-describedby="an-email-msg">
    </div>
    <span class="ds-pin" style="top:-8px;left:-30px">1</span>
    <span class="ds-pin" style="top:26px;left:-30px">2</span>
    <span class="ds-pin" style="top:58px;left:-30px">3</span>
    <span class="ds-pin" style="top:62px;right:-30px">4</span>
  </span>
</div>
```

1. **Label.** Always visible, above the field. An optional marker ("Opzionale") sits next to it: mark the optional fields, not the required ones.
2. **Message.** One line **above** the field: a hint by default, the error or success text when validation runs. Above, so it is not hidden by the keyboard or the thumb.
3. **Field.** 44px high, white surface, 1px border, `--radius-md`. The text starts with the input inset tokens.
4. **Value or placeholder.** The placeholder only gives an example; it never replaces the label.

## Variants

There is one size and one type. What changes is the text type through the native `type` attribute:

```html preview
<div class="ds-stack">
  <div class="field"><label class="field__label" for="v-t">Testo</label><input class="field__control" id="v-t" type="text" placeholder="Es. Bari"></div>
  <div class="field"><label class="field__label" for="v-e">Email</label><input class="field__control" id="v-e" type="email" placeholder="nome@email.it" autocomplete="email"></div>
  <div class="field"><label class="field__label" for="v-p">Telefono</label><input class="field__control" id="v-p" type="tel" placeholder="333 1234567" autocomplete="tel"></div>
</div>
```

Use the right `type` and `autocomplete`: they open the correct keyboard on mobile and let the browser fill the field.

## States

Seven states. Error and success change the border **and** the message text, never the colour alone.

```html preview
<div class="ds-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
  <div class="field"><label class="field__label">Default</label><p class="field__message">Messaggio di aiuto</p><input class="field__control" placeholder="Placeholder" tabindex="-1"></div>
  <div class="field"><label class="field__label">Hover</label><p class="field__message">Messaggio di aiuto</p><input class="field__control is-hover" placeholder="Placeholder" tabindex="-1"></div>
  <div class="field"><label class="field__label">Focus</label><p class="field__message">Messaggio di aiuto</p><input class="field__control is-focus" placeholder="Placeholder" tabindex="-1"></div>
  <div class="field"><label class="field__label">Compilato</label><p class="field__message">Messaggio di aiuto</p><input class="field__control" value="Bari" tabindex="-1"></div>
  <div class="field field--error"><label class="field__label">Errore</label><p class="field__message">Inserisci un indirizzo email valido.</p><input class="field__control" value="nome@" aria-invalid="true" tabindex="-1"></div>
  <div class="field field--success"><label class="field__label">Successo</label><p class="field__message">Email verificata.</p><input class="field__control" value="nome@email.it" tabindex="-1"></div>
  <div class="field"><label class="field__label" style="color: var(--text-disabled-default)">Disabilitato</label><p class="field__message">Messaggio di aiuto</p><input class="field__control" placeholder="Non disponibile" disabled></div>
</div>
```

## Usage

> [!DO]
> Say what is wrong and how to fix it in the message: "Inserisci un indirizzo email valido, per esempio nome@email.it". Validate when the person leaves the field, not on every key.

> [!DONT]
> Don't use the placeholder as the label, and don't show a red field with no text. Don't write "Campo obbligatorio" under every field: mark only the optional ones.

> [!DO]
> Keep the typed value when an error appears, and move the focus to the first field with an error after a failed submit.

> [!DONT]
> Don't clear the field on error and don't block pasting. Don't disable the submit button to hide errors: let people send, then explain.

## Code

```html component preview title="input.html"
<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-input-label-field);
    width: 100%;
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
  }
  .field__label {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-input-label-required);
    color: var(--text-default-body);
    font-size: var(--font-ui-label-font-size);
    line-height: var(--font-ui-label-line-height);
    font-weight: 600;
  }
  .field__optional {
    color: var(--text-default-caption);
    font-weight: 400;
  }
  .field__message {
    margin: 0;
    color: var(--text-default-caption);
    font-size: var(--font-caption-font-size);
    line-height: var(--font-caption-line-height);
  }
  .field__control {
    box-sizing: border-box;
    width: 100%;
    min-height: 44px;
    padding: var(--spacing-input-inset-vertical) var(--spacing-input-inset-horizontal);
    border: var(--border-width-sm) solid var(--border-default-default);
    border-radius: var(--radius-md);
    background: var(--surface-default);
    color: var(--text-default-body);
    font: inherit;
    font-size: var(--font-ui-input-font-size);
    line-height: var(--font-ui-input-line-height);
  }
  .field__control::placeholder { color: var(--text-default-placeholder); }
  .field__control:hover,
  .field__control.is-hover { border-color: var(--border-primary-default); }
  .field__control:focus-visible,
  .field__control.is-focus {
    outline: none;
    border: var(--border-width-md) solid var(--border-primary-focus);
    padding: calc(var(--spacing-input-inset-vertical) - var(--border-width-sm)) calc(var(--spacing-input-inset-horizontal) - var(--border-width-sm));
  }
  .field--error .field__message { color: var(--text-error-default); }
  .field--error .field__control { border: var(--border-width-md) solid var(--border-error-default); }
  .field--success .field__message { color: var(--text-success-default); }
  .field--success .field__control { border: var(--border-width-md) solid var(--border-success-default); }
  .field__control:disabled {
    border-color: var(--border-disabled-default);
    background: var(--surface-disabled-default-subtle);
    color: var(--text-disabled-default);
    cursor: not-allowed;
  }
</style>
<div class="field">
  <label class="field__label" for="email">Email</label>
  <p class="field__message" id="email-msg">Ti scriviamo la conferma qui.</p>
  <input class="field__control" id="email" type="email" autocomplete="email" aria-describedby="email-msg">
</div>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `text`, `email`, `tel`, `url`, `search` | `text` | Native input type. Chooses the mobile keyboard. |
| `autocomplete` | token | – | Lets the browser fill the field. Use the standard values (`email`, `name`, `tel`). |
| `aria-describedby` | id | – | Points to the message line. Update it when the message changes. |
| `aria-invalid` | `true` | – | Set it together with `field--error`. |
| `field--error`, `field--success` | class | – | Validation state on the `.field` wrapper. |
| `disabled` | attribute | – | Disables the field. Explain why in the message. |

## Design tokens

```tokens
used: code
match: input
```

## Accessibility

- **Label.** Every field has a `<label for>` linked to it. Never use only the placeholder.
- **Messages.** Link the message with `aria-describedby`. When an error appears, set `aria-invalid="true"` and announce it with `role="alert"` or a polite live region.
- **Focus.** The border goes to 2px in `--border-primary-focus`; the text does not move because the padding is reduced by the same amount.
- **Colour.** Error and success are shown by border, colour **and** text, so the state is clear without colour.
- **Target size.** The field is at least 44px high; the label is part of the clickable area.
- **Autocomplete.** Use `autocomplete` for personal data (WCAG 1.3.5).

## Figma

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=154-19736

## Changelog

- `2026-11-11`: Page filled from the Figma library: anatomy, seven states, usage, HTML code with tokens, props and accessibility.
