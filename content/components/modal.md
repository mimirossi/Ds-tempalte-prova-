---
title: Modal
group: Overlays
order: 10
type: component
status: Draft
description: A dialog that interrupts the page to ask for one decision.
figma: https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=165-19693
---

## Overview

A modal opens above the page and asks for **one decision** before anything else can happen: confirm a booking, cancel it, accept a rule. While it is open the page behind it cannot be used, so use it sparingly.

Use a modal when the answer changes what happens next and people must not miss it. If the message only informs, use an [alert](#/components/alert) in the page. If it asks for a long form, use a page. Never use a modal for ads or news.

```html preview
<div class="modal-demo">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="t-std">
      <div class="modal__header"><h2 class="modal__title" id="t-std">Prenota il tuo posto</h2><button class="modal__close" type="button" aria-label="Chiudi">✕</button></div>
      <p class="modal__text">Giovedì dalle 19: set dal vivo, ospiti e il vinile che gira. Lasciaci il tuo nome e ti scriviamo una conferma.</p>
      <div class="modal__actions"><button class="modal__button modal__button--neutral" type="button">Non ora</button><button class="modal__button" type="button">Prenota</button></div>
    </div>
</div>
```

## Anatomy

```html preview
<div class="ds-stage">
  <span class="ds-anat" style="margin: 36px 60px;">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="t-std">
      <div class="modal__header"><h2 class="modal__title" id="t-std">Prenota il tuo posto</h2><button class="modal__close" type="button" aria-label="Chiudi">✕</button></div>
      <p class="modal__text">Giovedì dalle 19: set dal vivo, ospiti e il vinile che gira. Lasciaci il tuo nome e ti scriviamo una conferma.</p>
      <div class="modal__actions"><button class="modal__button modal__button--neutral" type="button">Non ora</button><button class="modal__button" type="button">Prenota</button></div>
    </div>
    <span class="ds-pin" style="top:-8px;left:-34px">1</span>
    <span class="ds-pin" style="top:26px;left:-34px">2</span>
    <span class="ds-pin" style="top:26px;right:-34px">3</span>
    <span class="ds-pin" style="top:100px;left:-34px">4</span>
    <span class="ds-pin" style="bottom:20px;right:-34px">5</span>
  </span>
</div>
```

1. **Container.** `--surface-page`, `--radius-lg`, 24px padding, the strongest shadow (`elevation/xl`). It sits on the scrim.
2. **Title.** Says what is being decided, as a statement or question: "Prenota il tuo posto", "Annullare la prenotazione?".
3. **Close button.** ✕ in the corner, 44px target. It is always there.
4. **Body.** The consequence in one or two sentences.
5. **Actions.** Two buttons: the safe or neutral one on the left, the decision on the right. Verbs, never "Sì" and "No".

The **scrim** is the dark layer under the modal (`--shadow-2xl`, black at 40%). It is not part of the box but it is part of the component.

## Variants

Two types and two widths. **Standard** for choices that can be repeated; **Destructive** when the decision deletes or cannot be undone. **Medio** (560px) is the default; **Piccolo** (400px) for a yes/no question.

```html preview
<div class="ds-grid" style="grid-template-columns: 1fr; gap: 32px;">
  <div class="modal-demo modal-demo--light"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="t-std">
      <div class="modal__header"><h2 class="modal__title" id="t-std">Prenota il tuo posto</h2><button class="modal__close" type="button" aria-label="Chiudi">✕</button></div>
      <p class="modal__text">Giovedì dalle 19: set dal vivo, ospiti e il vinile che gira. Lasciaci il tuo nome e ti scriviamo una conferma.</p>
      <div class="modal__actions"><button class="modal__button modal__button--neutral" type="button">Non ora</button><button class="modal__button" type="button">Prenota</button></div>
    </div></div>
  <div class="modal-demo modal-demo--light"><div class="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="t-danger-s">
      <div class="modal__header"><h2 class="modal__title" id="t-danger-s">Annullare la prenotazione?</h2><button class="modal__close" type="button" aria-label="Chiudi">✕</button></div>
      <p class="modal__text">Se annulli adesso il tuo posto torna disponibile per altri. Non puoi recuperarlo dopo.</p>
      <div class="modal__actions"><button class="modal__button modal__button--neutral" type="button">Tieni il posto</button><button class="modal__button modal__button--danger" type="button">Annulla prenotazione</button></div>
    </div></div>
</div>
```

| Type | Primary action | First focus |
| --- | --- | --- |
| Standard | Pink "Prenota" | The first field, or the primary action |
| Destructive | Red "Annulla prenotazione" | The **safe** action ("Tieni il posto"), never the destructive one |

## States

The modal itself is either closed or open. Open it with a deliberate action and close it in three ways. On mobile it takes the full width, with the actions stacked.

```html preview
<div class="modal-demo">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="t-danger">
      <div class="modal__header"><h2 class="modal__title" id="t-danger">Annullare la prenotazione?</h2><button class="modal__close" type="button" aria-label="Chiudi">✕</button></div>
      <p class="modal__text">Se annulli adesso il tuo posto torna disponibile per altri. Non puoi recuperarlo dopo.</p>
      <div class="modal__actions"><button class="modal__button modal__button--neutral" type="button">Tieni il posto</button><button class="modal__button modal__button--danger" type="button">Annulla prenotazione</button></div>
    </div>
</div>
```

| Moment | What happens |
| --- | --- |
| Opening | The page is blocked, the focus moves inside, the scrim fades in (150ms, none with reduced motion). |
| Open | Focus stays inside (focus trap). The page behind does not scroll. |
| Closing | ✕, Esc, or the scrim. With unsaved input the scrim does not close it. The focus returns to the button that opened it. |

## Usage

> [!DO]
> Ask one question per modal: a title that says what, a body that says the consequence, two actions with clear verbs ("Prenota", "Annulla prenotazione"). Put the safe action first for destructive choices.

> [!DONT]
> Don't open a modal on page load, on exit or for marketing. Don't answer with "Sì" / "No" or "OK" / "Annulla", and don't put a long form or a scrolling page inside.

> [!DO]
> Always offer ✕ and Esc, and return the focus to the trigger on close.

> [!DONT]
> Don't open a modal from another modal, and don't close it by clicking the scrim when the person has typed something.

## Code

```html component preview title="modal.html"
<style>
  .modal {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-stack-lg);
    width: min(560px, calc(100vw - 32px));
    max-height: calc(100vh - 32px);
    padding: var(--spacing-inset-lg);
    border: 0;
    border-radius: var(--radius-lg);
    background: var(--surface-page);
    color: var(--text-default-body);
    box-shadow: var(--elevation-xl-offset-x) var(--elevation-xl-offset-y) var(--elevation-xl-blur) var(--elevation-xl-spread) var(--elevation-xl-color);
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
  }
  .modal--small { width: min(400px, calc(100vw - 32px)); }
  /* Native <dialog class="modal">: the browser draws the scrim. */
  .modal::backdrop { background: var(--shadow-2xl); }
  .modal__header { display: flex; align-items: flex-start; gap: var(--spacing-inline-md); }
  .modal__title {
    flex: 1;
    margin: 0;
    color: var(--text-default-heading);
    font-size: var(--font-heading-h3-font-size);
    line-height: var(--font-heading-h3-line-height);
    font-weight: 600;
  }
  .modal__close {
    flex: none;
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: var(--radius-full);
    background: transparent;
    color: var(--text-default-heading);
    font-size: var(--font-body-default-font-size);
    cursor: pointer;
  }
  .modal__close:hover { background: var(--surface-page-secondary); }
  .modal__text { margin: 0; font-size: var(--font-body-default-font-size); line-height: var(--font-body-default-line-height); }
  .modal__actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: var(--spacing-inline-md); }
  .modal__button {
    min-height: 44px;
    padding: var(--spacing-button-inset-vertical) var(--spacing-button-inset-horizontal);
    border: 0;
    border-radius: var(--radius-full);
    background: var(--surface-primary-default);
    color: var(--text-primary-default-on-colour);
    font: 500 var(--font-ui-button-font-size)/var(--font-ui-button-line-height) "Bricolage Grotesque", system-ui, sans-serif;
    cursor: pointer;
  }
  .modal__button:hover { background: var(--surface-primary-default-hover); }
  .modal__button--neutral { background: var(--surface-page-secondary); color: var(--text-default-body); }
  .modal__button--neutral:hover { background: var(--surface-page-secondary); box-shadow: inset 0 0 0 var(--border-width-sm) var(--border-default-default); }
  .modal__button--danger { background: var(--surface-error-default); color: var(--text-error-default-on-colour); }
  .modal__button--danger:hover { background: var(--surface-error-default-hover); }
  .modal__button:focus-visible,
  .modal__close:focus-visible { outline: var(--border-width-md) solid var(--border-primary-focus); outline-offset: var(--border-width-md); }
  @media (max-width: 480px) { .modal__actions { flex-direction: column-reverse; } .modal__button { width: 100%; } }
  /* Documentation only: shows the modal on its scrim inside the page. */
  .modal-demo { display: flex; justify-content: center; padding: 32px; border-radius: var(--radius-lg); background: var(--shadow-2xl); }
  .modal-demo--light { background: var(--surface-page-secondary); }
</style>
<dialog class="modal" id="booking" aria-labelledby="booking-title">
  <div class="modal__header">
    <h2 class="modal__title" id="booking-title">Prenota il tuo posto</h2>
    <button class="modal__close" type="button" aria-label="Chiudi" data-close>✕</button>
  </div>
  <p class="modal__text">Giovedì dalle 19: set dal vivo, ospiti e il vinile che gira.</p>
  <div class="modal__actions">
    <button class="modal__button modal__button--neutral" type="button" data-close>Non ora</button>
    <button class="modal__button" type="button">Prenota</button>
  </div>
</dialog>
<button type="button" onclick="document.getElementById('booking').showModal()">Apri</button>
```

```js title="modal.js"
// <dialog> already traps the focus, closes on Esc and returns the focus to the trigger.
const dialog = document.getElementById("booking");
dialog.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => dialog.close()));
// Close on scrim click only when nothing was typed.
dialog.addEventListener("click", (e) => { if (e.target === dialog && !dialog.querySelector(":invalid, input:not(:placeholder-shown)")) dialog.close(); });
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modal--small` | class | 560px | Narrow dialog (400px) for a yes/no question. |
| `modal__button--danger` | class | primary | Destructive action. Use with the safe action focused first. |
| `aria-labelledby` | id | – | Points to `.modal__title`. Required. |
| `autofocus` | attribute | – | Put it on the element that must get the first focus (the safe action in destructive modals). |
| `showModal()`, `close()` | method | – | Open and close the `<dialog>`. Closing returns the focus to the trigger. |

## Design tokens

```tokens
used: code
match: modal
```

## Accessibility

- **Native dialog.** `<dialog>` opened with `showModal()` gives focus trap, Esc, inert page and scrim. If you can't use it, add `role="dialog"`, `aria-modal="true"` and handle them yourself.
- **Name.** `aria-labelledby` points to the title. Add `aria-describedby` for the body when it is short.
- **First focus.** On the first field or the primary action. In destructive modals, on the **safe** action (`autofocus`).
- **Return focus.** When it closes, the focus goes back to the control that opened it.
- **Scroll.** Block the scroll of the page behind (`body { overflow: hidden }` while open).
- **Target size.** Close and action buttons are at least 44px.
- **Motion.** Fade the scrim in 150ms and drop it with `prefers-reduced-motion`.

## Figma

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=165-19693

## Changelog

- `2026-11-11`: Page filled from the Figma library: two types, two widths, open and close behaviour, usage, HTML and JS code with tokens, props and accessibility.
