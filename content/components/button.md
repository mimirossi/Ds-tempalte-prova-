---
title: Button
group: Actions
order: 10
type: component
status: Draft
description: Triggers an action, such as submitting a form, opening a dialog or starting a set.
figma: https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=152-19717
---

## Overview

A button starts an action in the current view: send a form, open a dialog, play a set. It is a pill with a short verb label and a minimum height of 44px, so it is easy to hit on touch screens.

Use a button for **actions** and a link for **navigation**. If the click changes the address of the page, it is a link, not a button. Keep one **Primary** per view: it is the action you want most people to take.

```html preview
<div class="ds-stage">
  <button class="button">Prenota il posto</button>
  <button class="button button--accent">Ascolta il set</button>
  <button class="button button--neutral">Non ora</button>
</div>
```

## Anatomy

```html preview
<div class="ds-stage">
  <span class="ds-anat">
    <button class="button">
      <svg class="button__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4l10 6-10 6z" fill="currentColor"/></svg>
      Apri SoundCloud
    </button>
    <span class="ds-pin" style="top:-16px;left:-16px">1</span>
    <span class="ds-pin" style="bottom:-16px;left:14px">2</span>
    <span class="ds-pin" style="bottom:-16px;left:58px">3</span>
  </span>
</div>
```

1. **Container.** Pill shape (`--radius-full`), minimum 44px high and 112px wide, padded with the button spacing tokens.
2. **Icon (optional).** 20px, same colour as the label, separated by `--spacing-button-icon-label`. Never use an icon alone without an accessible name.
3. **Label.** One to three words, starting with a verb: "Prenota", "Ascolta il set". Medium weight, `font/ui/button`.

## Variants

Four variants carry different weight. Pick by the role of the action in the view, not by the colour you like.

```html preview
<div class="ds-grid" style="grid-template-columns: repeat(4, auto);">
  <div class="ds-col"><button class="button">Prenota</button><span class="ds-cap">Primary</span></div>
  <div class="ds-col"><button class="button button--accent">Ascolta</button><span class="ds-cap">Accent</span></div>
  <div class="ds-col"><button class="button button--neutral">Non ora</button><span class="ds-cap">Neutral</span></div>
  <div class="ds-col"><button class="button button--danger">Elimina</button><span class="ds-cap">Danger</span></div>
</div>
```

| Variant | Use it for |
| --- | --- |
| Primary (pink) | The main action of the view. One per view. |
| Accent (lime) | A second highlighted action in a different area, for example "Ascolta il set" in a card. Never next to a Primary. |
| Neutral | Secondary and cancel actions: "Non ora", "Annulla". |
| Danger | Actions that delete or cannot be undone. Always confirm in a [modal](#/components/modal). |

With an icon, the icon goes **before** the label and is optional:

```html preview
<div class="ds-stage">
  <button class="button">
    <svg class="button__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4l10 6-10 6z" fill="currentColor"/></svg>
    Apri SoundCloud
  </button>
  <button class="button button--neutral">Condividi</button>
</div>
```

## States

Every variant has the same five states. Hover darkens the surface, focus draws a ring outside the button, disabled drops to the disabled surface and loading replaces the label with a spinner and blocks new clicks.

```html preview
<div class="ds-grid" style="grid-template-columns: repeat(5, auto);">
  <div class="ds-col"><button class="button">Prenota</button><span class="ds-cap">Default</span></div>
  <div class="ds-col"><button class="button is-hover">Prenota</button><span class="ds-cap">Hover</span></div>
  <div class="ds-col"><button class="button is-focus">Prenota</button><span class="ds-cap">Focus</span></div>
  <div class="ds-col"><button class="button" disabled>Prenota</button><span class="ds-cap">Disabled</span></div>
  <div class="ds-col"><button class="button is-loading" aria-busy="true"><span class="button__spinner" aria-hidden="true"></span>Invio…</button><span class="ds-cap">Loading</span></div>
</div>
```

```html preview
<div class="ds-grid" style="grid-template-columns: repeat(5, auto);">
  <button class="button button--accent">Ascolta</button>
  <button class="button button--accent is-hover">Ascolta</button>
  <button class="button button--accent is-focus">Ascolta</button>
  <button class="button button--accent" disabled>Ascolta</button>
  <button class="button button--accent is-loading" aria-busy="true"><span class="button__spinner" aria-hidden="true"></span>Carico…</button>
</div>
```

> [!NOTE]
> Neutral shows a thin border on hover instead of getting darker, because its surface is already the lightest grey.

## Usage

> [!DO]
> Start the label with a verb and say what happens: "Prenota il posto", "Ascolta il set". Keep one Primary per view and put the Neutral action next to it.

> [!DONT]
> Don't use "Clicca qui", "OK" or "Invia" alone. Don't put two Primary or two Accent buttons side by side: the user cannot tell which one matters.

> [!DO]
> Keep the button enabled and explain the problem when a form is incomplete. When the button is disabled, say why in the text next to it.

> [!DONT]
> Don't disable a button without any explanation, and don't remove the label while loading: keep the width stable so the layout does not jump.

> [!DO]
> Use Danger only for actions that delete data, and confirm in a modal with the safe action focused first.

> [!DONT]
> Don't use a button to navigate to another page. Use a link styled with the same classes if the look has to match.

## Code

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

```html component preview title="button.html"
<style>
  .button {
    --button-bg: var(--surface-primary-default);
    --button-bg-hover: var(--surface-primary-default-hover);
    --button-fg: var(--text-primary-default-on-colour);
    display: inline-flex;
    min-width: 112px;
    min-height: 44px;
    padding: var(--spacing-button-inset-vertical) var(--spacing-button-inset-horizontal);
    justify-content: center;
    align-items: center;
    gap: var(--spacing-button-icon-label);
    border: var(--border-width-none) solid transparent;
    border-radius: var(--radius-full);
    background: var(--button-bg);
    color: var(--button-fg);
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
    font-size: var(--font-ui-button-font-size);
    line-height: var(--font-ui-button-line-height);
    font-weight: 500;
    cursor: pointer;
    transition: background-color 150ms ease;
  }
  .button--accent {
    --button-bg: var(--surface-accent-default);
    --button-bg-hover: var(--surface-accent-default-hover);
    --button-fg: var(--text-accent-default-on-colour);
  }
  .button--neutral {
    --button-bg: var(--surface-page-secondary);
    --button-bg-hover: var(--surface-page-secondary);
    --button-fg: var(--text-default-body);
  }
  .button--danger {
    --button-bg: var(--surface-error-default);
    --button-bg-hover: var(--surface-error-default-hover);
    --button-fg: var(--text-error-default-on-colour);
  }
  .button:hover,
  .button.is-hover { background: var(--button-bg-hover); }
  .button--neutral:hover,
  .button--neutral.is-hover { box-shadow: inset 0 0 0 var(--border-width-sm) var(--border-default-default); }
  .button:focus-visible,
  .button.is-focus {
    outline: var(--border-width-md) solid var(--border-primary-focus);
    outline-offset: var(--border-width-md);
  }
  .button:disabled,
  .button.is-disabled {
    background: var(--surface-disabled-default);
    color: var(--text-disabled-default);
    box-shadow: none;
    cursor: not-allowed;
  }
  .button.is-loading { pointer-events: none; }
  .button__icon { flex: none; }
  .button__spinner {
    width: 16px;
    height: 16px;
    border: var(--border-width-md) solid currentColor;
    border-top-color: transparent;
    border-radius: var(--radius-full);
    animation: button-spin 800ms linear infinite;
  }
  @keyframes button-spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    .button { transition: none; }
    .button__spinner { animation-duration: 2s; }
  }
</style>
<button class="button" type="button">Prenota il posto</button>
```

> [!NOTE]
> The React example above still uses fixed hex colours and a medium corner radius. It does not follow the tokens and the pill shape of the Figma button yet: replace the values with the same `var(--…)` tokens used in the HTML version.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `button`, `button--accent`, `button--neutral`, `button--danger` | `button` | Variant. Primary is the base class, the others are added to it. |
| `is-loading` | class | – | Shows the spinner, blocks clicks. Add `aria-busy="true"` and keep the label in the DOM. |
| `disabled` | attribute | – | Disables the button. Use it only when the action is not available. |
| `type` | `button`, `submit` | `button` | Always set it: a button inside a form submits it by default. |
| `is-hover`, `is-focus` | class | – | Only to show a state in documentation. Do not use in product code. |

## Design tokens

```tokens
used: code
match: button
```

## Accessibility

- **Keyboard.** Reached with Tab, activated with Enter and Space. Use a real `<button>`, never a `<div>` with a click handler.
- **Focus.** A 2px ring in `--border-primary-focus`, drawn outside the button with a 2px gap, visible on every variant. Never remove the outline without replacing it.
- **Target size.** At least 44 × 44px, including icon-only buttons.
- **Name.** The label is the accessible name. An icon-only button needs `aria-label`.
- **Loading.** Set `aria-busy="true"` and announce the result in a live region (`aria-live="polite"`) when it ends.
- **Contrast.** Label colours are chosen to reach 4.5:1 on each variant surface. Disabled buttons are exempt from the rule, so never rely on them to carry meaning.

## Figma

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=152-19717

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=109-1028&t=kLZIsNzzPl37Nkej-4

## Changelog

- `2026-11-11`: Page filled from the Figma library: description, anatomy, four variants, five states, usage, HTML code with tokens, props and accessibility. HTML code switched to the pill shape and the button tokens.
