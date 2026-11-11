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
      <svg class="button__icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z" fill="currentColor"/></svg>
      Apri SoundCloud
    </button>
    <span class="ds-pin" style="top:-16px;left:-16px">1</span>
    <span class="ds-pin" style="bottom:-16px;left:14px">2</span>
    <span class="ds-pin" style="bottom:-16px;left:58px">3</span>
  </span>
</div>
```

1. **Container.** Pill shape (`--radius-full`), minimum 44px high and 112px wide, padded with the button spacing tokens. The Link variant has no horizontal padding (`--spacing-button-inset-text-only`).
2. **Icon (optional).** 24px, same colour as the label, separated by `--spacing-button-icon-label`. Never use an icon alone without an accessible name.
3. **Label.** One to three words, starting with a verb: "Prenota", "Ascolta il set". Medium weight, `font/ui/button`.

## Variants

Seven variants carry different weight. Pick by the role of the action in the view, not by the colour you like.

```html preview
<div class="ds-grid" style="grid-template-columns: repeat(auto-fit, minmax(110px, auto));">
  <div class="ds-col"><button class="button">Prenota</button><span class="ds-cap">Primary</span></div>
  <div class="ds-col"><button class="button button--accent">Ascolta</button><span class="ds-cap">Accent</span></div>
  <div class="ds-col"><button class="button button--neutral">Non ora</button><span class="ds-cap">Neutral</span></div>
  <div class="ds-col"><button class="button button--danger">Elimina</button><span class="ds-cap">Danger</span></div>
  <div class="ds-col"><button class="button button--secondary">Condividi</button><span class="ds-cap">Secondary</span></div>
  <div class="ds-col"><button class="button button--outlined">Dettagli</button><span class="ds-cap">Outlined</span></div>
  <div class="ds-col"><button class="button button--link">Scopri di più</button><span class="ds-cap">Link</span></div>
</div>
```

| Variant | Use it for |
| --- | --- |
| Primary (pink) | The main action of the view. One per view. |
| Accent (pale lime) | A second highlighted action in a different area, for example "Ascolta il set" in a card. Low emphasis: subtle surface, accent text. Never next to a Primary. |
| Neutral | Secondary and cancel actions: "Non ora", "Annulla". |
| Danger | Actions that delete or cannot be undone. Always confirm in a [modal](#/components/modal). |
| Secondary (soft pink) | An alternative to the Primary, with a filled surface but less weight. |
| Outlined | A quiet action next to a filled one: transparent surface, Primary border and text. |
| Link | An underlined text action inside a block of text or a tight layout. Keeps the 44px touch area, with no horizontal padding. |

With an icon, the icon goes **before** the label and is optional:

```html preview
<div class="ds-stage">
  <button class="button">
    <svg class="button__icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z" fill="currentColor"/></svg>
    Apri SoundCloud
  </button>
  <button class="button button--neutral">Condividi</button>
</div>
```

## States

Every variant has the same five states. Hover changes the surface tone (lighter on Primary and Secondary, darker on Danger, a thin border on Neutral, a subtle fill on Outlined). Focus draws a 2px ring on the edge of the button. Disabled drops to the disabled surface but stays focusable. Loading shows a spinner and changes the label to "Un attimo…".

```html preview
<div class="ds-grid" style="grid-template-columns: repeat(5, auto); justify-items: center;">
  <span class="ds-cap">Default</span><span class="ds-cap">Hover</span><span class="ds-cap">Focus</span><span class="ds-cap">Disabled</span><span class="ds-cap">Loading</span>

  <button class="button">Ascolta il set</button>
  <button class="button is-hover">Ascolta il set</button>
  <button class="button is-focus">Ascolta il set</button>
  <button class="button" aria-disabled="true">Ascolta il set</button>
  <button class="button is-loading" aria-busy="true"><span class="button__spinner" aria-hidden="true"></span>Un attimo…</button>

  <button class="button button--accent">Ascolta il set</button>
  <button class="button button--accent is-hover">Ascolta il set</button>
  <button class="button button--accent is-focus">Ascolta il set</button>
  <button class="button button--accent" aria-disabled="true">Ascolta il set</button>
  <button class="button button--accent is-loading" aria-busy="true"><span class="button__spinner" aria-hidden="true"></span>Un attimo…</button>

  <button class="button button--neutral">Ascolta il set</button>
  <button class="button button--neutral is-hover">Ascolta il set</button>
  <button class="button button--neutral is-focus">Ascolta il set</button>
  <button class="button button--neutral" aria-disabled="true">Ascolta il set</button>
  <button class="button button--neutral is-loading" aria-busy="true"><span class="button__spinner" aria-hidden="true"></span>Un attimo…</button>

  <button class="button button--danger">Ascolta il set</button>
  <button class="button button--danger is-hover">Ascolta il set</button>
  <button class="button button--danger is-focus">Ascolta il set</button>
  <button class="button button--danger" aria-disabled="true">Ascolta il set</button>
  <button class="button button--danger is-loading" aria-busy="true"><span class="button__spinner" aria-hidden="true"></span>Un attimo…</button>

  <button class="button button--secondary">Ascolta il set</button>
  <button class="button button--secondary is-hover">Ascolta il set</button>
  <button class="button button--secondary is-focus">Ascolta il set</button>
  <button class="button button--secondary" aria-disabled="true">Ascolta il set</button>
  <button class="button button--secondary is-loading" aria-busy="true"><span class="button__spinner" aria-hidden="true"></span>Un attimo…</button>

  <button class="button button--outlined">Ascolta il set</button>
  <button class="button button--outlined is-hover">Ascolta il set</button>
  <button class="button button--outlined is-focus">Ascolta il set</button>
  <button class="button button--outlined" aria-disabled="true">Ascolta il set</button>
  <button class="button button--outlined is-loading" aria-busy="true"><span class="button__spinner" aria-hidden="true"></span>Un attimo…</button>

  <button class="button button--link">Ascolta il set</button>
  <button class="button button--link is-hover">Ascolta il set</button>
  <button class="button button--link is-focus">Ascolta il set</button>
  <button class="button button--link" aria-disabled="true">Ascolta il set</button>
  <button class="button button--link is-loading" aria-busy="true"><span class="button__spinner" aria-hidden="true"></span>Un attimo…</button>
</div>
```

> [!NOTE]
> Neutral shows a thin border on hover instead of changing colour, because its surface is already the lightest grey. Link has no visible hover change yet.

## Usage

> [!DO]
> Start the label with a verb and say what happens: "Prenota il posto", "Ascolta il set". Keep one Primary per view and put the Neutral action next to it.

> [!DONT]
> Don't use "Clicca qui", "OK" or "Invia" alone. Don't put two Primary or two Accent buttons side by side: the user cannot tell which one matters.

> [!DO]
> Keep the button enabled and explain the problem when a form is incomplete. Disable it only when the action is really not available (a sold-out set) and say why in a caption under the button.

> [!DONT]
> Don't disable a button without any explanation, and don't remove the label while loading: keep it next to the spinner, as "Un attimo…".

> [!DO]
> Use Danger only for actions that delete data, and confirm in a modal with the safe action focused first.

> [!DONT]
> Don't use a button to navigate to another page. Use a link styled with the same classes if the look has to match.

## Code

```tsx component preview
type ButtonVariant = "primary" | "accent" | "neutral" | "danger" | "secondary" | "outlined" | "link";

const base =
  "inline-flex min-h-11 items-center justify-center gap-[var(--spacing-button-icon-label)] rounded-[var(--radius-full)] border-0 py-[var(--spacing-button-inset-vertical)] font-medium text-[length:var(--font-ui-button-font-size)] leading-[var(--font-ui-button-line-height)] whitespace-nowrap cursor-pointer transition-[background-color,box-shadow] duration-150 focus-visible:outline-2 focus-visible:outline-transparent";
const pill = "min-w-28 px-[var(--spacing-button-inset-horizontal)]";
const ring = (color: string) =>
  `focus-visible:shadow-[inset_0_0_0_var(--border-width-md)_var(${color})]`;
const disabledFilled =
  "bg-[var(--surface-disabled-default)] text-[color:var(--text-disabled-default)] cursor-not-allowed";

const variants: Record<ButtonVariant, { rest: string; hover: string; focus: string; disabled: string; loading?: string }> = {
  primary: {
    rest: `${pill} bg-[var(--surface-primary-default)] text-[color:var(--text-primary-default-on-colour)]`,
    hover: "hover:bg-[var(--surface-primary-default-hover)]",
    focus: ring("--border-primary-focus"),
    disabled: `${pill} ${disabledFilled}`,
  },
  accent: {
    rest: `${pill} bg-[var(--surface-accent-default-subtle)] text-[color:var(--text-accent-default)]`,
    hover: "hover:bg-[var(--surface-accent-default-subtle-hover)] hover:text-[color:var(--text-accent-hover)]",
    focus: ring("--border-accent-focus"),
    disabled: `${pill} ${disabledFilled}`,
  },
  neutral: {
    rest: `${pill} bg-[var(--surface-page-secondary)] text-[color:var(--text-default-body)]`,
    hover: "hover:shadow-[inset_0_0_0_var(--border-width-sm)_var(--border-default-default)]",
    focus: ring("--border-primary-focus"),
    disabled: `${pill} ${disabledFilled}`,
  },
  danger: {
    rest: `${pill} bg-[var(--surface-error-default)] text-[color:var(--text-error-default-on-colour)]`,
    hover: "hover:bg-[var(--surface-error-default-hover)]",
    focus: ring("--border-primary-focus"),
    disabled: `${pill} ${disabledFilled}`,
  },
  secondary: {
    rest: `${pill} bg-[var(--surface-secondary-default)] text-[color:var(--text-secondary-default-on-colour)]`,
    hover: "hover:bg-[var(--surface-secondary-default-hover)] hover:text-[color:var(--text-secondary-hover-on-colour)]",
    focus: ring("--border-secondary-focus"),
    disabled: `${pill} ${disabledFilled} text-[color:var(--text-disabled-default-on-colour)]`,
  },
  outlined: {
    rest: `${pill} bg-transparent text-[color:var(--text-primary-default)] shadow-[inset_0_0_0_var(--border-width-sm)_var(--border-primary-default)]`,
    hover:
      "hover:bg-[var(--surface-primary-default-subtle)] hover:text-[color:var(--text-primary-hover)] hover:shadow-[inset_0_0_0_var(--border-width-sm)_var(--border-primary-default-hover)]",
    focus: ring("--border-primary-focus"),
    disabled: `${pill} bg-transparent text-[color:var(--text-disabled-default)] cursor-not-allowed shadow-[inset_0_0_0_var(--border-width-sm)_var(--border-disabled-default)]`,
  },
  link: {
    rest: "px-[var(--spacing-button-inset-text-only)] bg-transparent text-[color:var(--text-default-body)] underline [text-underline-position:from-font]",
    hover: "",
    focus: ring("--border-primary-focus"),
    disabled: "px-[var(--spacing-button-inset-text-only)] bg-transparent text-[color:var(--text-disabled-default)] underline [text-underline-position:from-font] cursor-not-allowed",
    loading: "text-[color:var(--text-primary-default)]",
  },
};

function Button({
  label = "Ascolta il set",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  ...props
}: ButtonProps) {
  const v = variants[variant as ButtonVariant];
  const inactive = disabled || loading;

  return (
    <button
      type="button"
      aria-disabled={disabled || undefined}
      aria-busy={loading || undefined}
      onClick={(event) => {
        if (!inactive) onClick?.(event);
      }}
      className={[
        base,
        disabled ? v.disabled : v.rest,
        !inactive && v.hover,
        v.focus,
        loading && `pointer-events-none ${v.loading ?? ""}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-6 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {loading ? "Un attimo…" : label}
    </button>
  );
}

export default function App() {
  const [sent, setSent] = useState(false);

  return (
    <main className="flex min-h-dvh flex-wrap items-center justify-center gap-4 p-6">
      <Button label="Prenota il posto" onClick={() => setSent(true)} />
      <Button label="Ascolta il set" variant="accent" />
      <Button label="Non ora" variant="neutral" />
      <Button label="Elimina" variant="danger" />
      <Button label="Condividi" variant="secondary" />
      <Button label="Dettagli" variant="outlined" />
      <Button label="Scopri di più" variant="link" />
      <p className="sr-only" aria-live="polite">
        {sent ? "Azione completata" : ""}
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
    --button-fg-hover: var(--button-fg);
    --button-ring-w: 0px;
    --button-ring-c: transparent;
    --button-ring-w-hover: var(--button-ring-w);
    --button-ring-c-hover: var(--button-ring-c);
    --button-focus: var(--border-primary-focus);
    --button-inset-x: var(--spacing-button-inset-horizontal);
    box-sizing: border-box;
    display: inline-flex;
    min-width: 112px;
    min-height: 44px;
    padding: var(--spacing-button-inset-vertical) var(--button-inset-x);
    justify-content: center;
    align-items: center;
    gap: var(--spacing-button-icon-label);
    border: 0;
    border-radius: var(--radius-full);
    background: var(--button-bg);
    box-shadow: inset 0 0 0 var(--button-ring-w) var(--button-ring-c);
    color: var(--button-fg);
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
    font-variation-settings: "opsz" 14, "wdth" 100;
    font-size: var(--font-ui-button-font-size);
    line-height: var(--font-ui-button-line-height);
    letter-spacing: var(--font-ui-button-letter-spacing);
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 150ms ease, box-shadow 150ms ease;
  }

  /* Variants. Each one only sets variables. */
  .button--accent {
    --button-bg: var(--surface-accent-default-subtle);
    --button-bg-hover: var(--surface-accent-default-subtle-hover);
    --button-fg: var(--text-accent-default);
    --button-fg-hover: var(--text-accent-hover);
    --button-focus: var(--border-accent-focus);
  }
  .button--neutral {
    --button-bg: var(--surface-page-secondary);
    --button-bg-hover: var(--surface-page-secondary);
    --button-fg: var(--text-default-body);
    --button-ring-w-hover: var(--border-width-sm);
    --button-ring-c-hover: var(--border-default-default);
  }
  .button--danger {
    --button-bg: var(--surface-error-default);
    --button-bg-hover: var(--surface-error-default-hover);
    --button-fg: var(--text-error-default-on-colour);
  }
  .button--secondary {
    --button-bg: var(--surface-secondary-default);
    --button-bg-hover: var(--surface-secondary-default-hover);
    --button-fg: var(--text-secondary-default-on-colour);
    --button-fg-hover: var(--text-secondary-hover-on-colour);
    --button-focus: var(--border-secondary-focus);
  }
  .button--outlined {
    --button-bg: transparent;
    --button-bg-hover: var(--surface-primary-default-subtle);
    --button-fg: var(--text-primary-default);
    --button-fg-hover: var(--text-primary-hover);
    --button-ring-w: var(--border-width-sm);
    --button-ring-c: var(--border-primary-default);
    --button-ring-c-hover: var(--border-primary-default-hover);
  }
  .button--link {
    --button-bg: transparent;
    --button-bg-hover: transparent;
    --button-fg: var(--text-default-body);
    --button-inset-x: var(--spacing-button-inset-text-only);
    min-width: 0;
    text-decoration: underline;
    text-underline-position: from-font;
  }

  /* States */
  .button:hover:not([aria-disabled="true"]):not(.is-loading),
  .button.is-hover {
    background: var(--button-bg-hover);
    color: var(--button-fg-hover);
    box-shadow: inset 0 0 0 var(--button-ring-w-hover) var(--button-ring-c-hover);
  }
  .button[aria-disabled="true"],
  .button.is-disabled {
    background: var(--surface-disabled-default);
    color: var(--text-disabled-default);
    box-shadow: none;
    cursor: not-allowed;
  }
  .button--secondary[aria-disabled="true"] { color: var(--text-disabled-default-on-colour); }
  .button--outlined[aria-disabled="true"] {
    background: transparent;
    box-shadow: inset 0 0 0 var(--border-width-sm) var(--border-disabled-default);
  }
  .button--link[aria-disabled="true"] { background: transparent; }
  .button:focus-visible,
  .button.is-focus {
    outline: var(--border-width-md) solid transparent; /* keeps the ring visible in forced-colours mode */
    box-shadow: inset 0 0 0 var(--border-width-md) var(--button-focus);
  }
  .button--link.is-loading { color: var(--text-primary-default); }
  .button.is-loading { pointer-events: none; }

  .button__icon { flex: none; }
  .button__spinner {
    flex: none;
    width: 24px;
    height: 24px;
    box-sizing: border-box;
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

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `button`, `button--accent`, `button--neutral`, `button--danger`, `button--secondary`, `button--outlined`, `button--link` | `button` | Variant. Primary is the base class, the others are added to it. |
| `is-loading` | class | – | Shows the spinner and blocks clicks. Add `aria-busy="true"`, put the spinner before the label and change the label to "Un attimo…". |
| `aria-disabled` | `"true"` | – | Marks the action as not available. The button stays focusable: ignore the click in your handler and explain why in a caption. |
| `type` | `button`, `submit` | `button` | Always set it: a button inside a form submits it by default. |
| `is-hover`, `is-focus` | class | – | Only to show a state in documentation. Do not use in product code. |

## Design tokens

```tokens
used: code
match: button
```

## Accessibility

- **Keyboard.** Reached with Tab, activated with Enter and Space. Use a real `<button>`, never a `<div>` with a click handler.
- **Focus.** A 2px ring on the edge of the button, in `--border-primary-focus` (`--border-accent-focus` on Accent, `--border-secondary-focus` on Secondary), visible on every variant. Never remove the outline without replacing it.
- **Target size.** At least 44 × 44px, including icon-only buttons and the Link variant.
- **Name.** The label is the accessible name. An icon-only button needs `aria-label`.
- **Disabled.** Use `aria-disabled="true"` instead of the `disabled` attribute so the button can still be reached with the keyboard, and explain the reason in the text next to it.
- **Loading.** Set `aria-busy="true"` and announce the result in a live region (`aria-live="polite"`) when it ends.
- **Contrast.** Label colours are chosen to reach 4.5:1 on each variant surface. Disabled buttons are exempt from the rule, so never rely on them to carry meaning.

## Figma

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=152-19717

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=152-19716

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=109-1028&t=kLZIsNzzPl37Nkej-4

## Changelog

- `2026-11-11`: Page filled from the Figma library: description, anatomy, four variants, five states, usage, HTML code with tokens, props and accessibility. HTML code switched to the pill shape and the button tokens.
- `2026-11-11`: Code and previews updated to the new Figma component: seven variants (added Secondary, Outlined, Link), Accent on the subtle surface, 2px focus ring on the edge, `aria-disabled`, 24px spinner with the "Un attimo…" label. The React example now uses the tokens and the pill shape.
