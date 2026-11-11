---
title: Alert
group: Feedback
order: 10
type: component
status: Draft
description: An inline message that says what happened and what to do next.
figma: https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=164-19764
---

## Overview

An alert is a message **inside the page**, next to the thing it talks about: a form that failed, a booking that worked, a warning about the last seats. It states what happened and, when needed, what to do next.

Use an alert for feedback that people must not miss but that does not stop them. If the message blocks the flow and needs a decision, use a [modal](#/components/modal). For a label on an item use a [badge](#/components/badge).

```html preview
<div class="ds-stack">
  <div class="alert alert--success" role="status">
    <span class="alert__icon" aria-hidden="true">✓</span>
    <div class="alert__body"><p class="alert__title">Posto prenotato</p><p class="alert__text">Ti abbiamo scritto una conferma: portala con te all'ingresso.</p></div>
    <button class="alert__close" type="button" aria-label="Chiudi messaggio">✕</button>
  </div>
</div>
```

## Anatomy

```html preview
<div class="ds-stage">
  <span class="ds-anat" style="width: 520px;">
    <div class="alert alert--info" role="status">
    <span class="alert__icon" aria-hidden="true">i</span>
    <div class="alert__body"><p class="alert__title">Informazione</p><p class="alert__text">Il set live di giovedì inizia alle 19:00, porta il tuo vinile.</p></div>
    <button class="alert__close" type="button" aria-label="Chiudi messaggio">✕</button>
  </div>
    <span class="ds-pin" style="top:-18px;left:-4px">1</span>
    <span class="ds-pin" style="top:-18px;left:30px">2</span>
    <span class="ds-pin" style="top:-18px;left:70px">3</span>
    <span class="ds-pin" style="top:-18px;right:-4px">4</span>
  </span>
</div>
```

1. **Container.** Light surface of the tone with a 1px border in the strong colour, `--radius-md`.
2. **Icon.** 24px circle with a symbol: i, ✓, ▲ or !. It carries the meaning together with the title.
3. **Title and message.** The title names the type in one to three words; the message says what happened and what to do.
4. **Close button (optional).** 44px target, only for messages that can be dismissed.

## Variants

Four types. Each pairs a colour with its own icon and a title, so the meaning never relies on colour alone.

```html preview
<div class="ds-stack">
  <div class="alert alert--info" role="status">
    <span class="alert__icon" aria-hidden="true">i</span>
    <div class="alert__body"><p class="alert__title">Informazione</p><p class="alert__text">Il set live di giovedì inizia alle 19:00, porta il tuo vinile.</p></div>
    <button class="alert__close" type="button" aria-label="Chiudi messaggio">✕</button>
  </div>
  <div class="alert alert--success" role="status">
    <span class="alert__icon" aria-hidden="true">✓</span>
    <div class="alert__body"><p class="alert__title">Fatto</p><p class="alert__text">Il tuo posto è prenotato. Ti scriviamo una conferma.</p></div>
    <button class="alert__close" type="button" aria-label="Chiudi messaggio">✕</button>
  </div>
  <div class="alert alert--warning" role="alert">
    <span class="alert__icon" aria-hidden="true">▲</span>
    <div class="alert__body"><p class="alert__title">Attenzione</p><p class="alert__text">Restano pochi posti: prenota entro mercoledì sera.</p></div>
    
  </div>
  <div class="alert alert--error" role="alert">
    <span class="alert__icon" aria-hidden="true">!</span>
    <div class="alert__body"><p class="alert__title">Errore</p><p class="alert__text">Non siamo riuscite a inviare la prenotazione. Riprova.</p></div>
    
  </div>
</div>
```

| Type | Role | Dismissible |
| --- | --- | --- |
| Info | Neutral news, `role="status"` | Yes |
| Successo | Confirms that an action worked, `role="status"` | Yes |
| Attenzione | Something may go wrong soon, `role="alert"` | No, while the problem exists |
| Errore | Something went wrong, `role="alert"` | No, until it is fixed |

## States

An alert has no hover or focus state of its own. The only interactive part is the close button, which follows the button states:

```html preview
<div class="ds-stack">
  <div class="alert alert--info" role="status">
    <span class="alert__icon" aria-hidden="true">i</span>
    <div class="alert__body"><p class="alert__title">Con chiusura</p><p class="alert__text">Premi ✕ o Esc per chiudere il messaggio.</p></div>
    <button class="alert__close" type="button" aria-label="Chiudi messaggio">✕</button>
  </div>
  <div class="alert alert--info" role="status">
    <span class="alert__icon" aria-hidden="true">i</span>
    <div class="alert__body"><p class="alert__title">Senza chiusura</p><p class="alert__text">Il messaggio resta finché serve.</p></div>
    
  </div>
</div>
```

## Usage

> [!DO]
> Say what happened and what to do: "Non siamo riuscite a inviare la prenotazione. Controlla la connessione e riprova." Put the alert above the form or field it refers to.

> [!DONT]
> Don't write codes or blame the user ("Errore 500", "Hai sbagliato"). Don't use the red type for something that is only a notice.

> [!DO]
> Keep Errore and Attenzione on screen until the problem is solved. Let Info and Successo be closed and don't bring them back in the same visit.

> [!DONT]
> Don't make the message disappear on its own when it holds an action or something to read, and don't stack more than two alerts on a page.

## Code

```html component preview title="alert.html"
<style>
  .alert {
    --alert-bg: var(--surface-information-default-subtle);
    --alert-border: var(--border-information-default);
    --alert-icon: var(--surface-information-default);
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-inline-md);
    width: 100%;
    padding: var(--spacing-inset-md) var(--spacing-inset-sm) var(--spacing-inset-md) var(--spacing-inset-md);
    border: var(--border-width-sm) solid var(--alert-border);
    border-radius: var(--radius-md);
    background: var(--alert-bg);
    color: var(--text-default-body);
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
  }
  .alert--success { --alert-bg: var(--surface-success-default-subtle); --alert-border: var(--border-success-default); --alert-icon: var(--surface-success-default); }
  .alert--warning { --alert-bg: var(--surface-warning-default-subtle); --alert-border: var(--border-warning-default); --alert-icon: var(--surface-warning-default); }
  .alert--error { --alert-bg: var(--surface-error-default-subtle); --alert-border: var(--border-error-default); --alert-icon: var(--surface-error-default); }
  .alert__icon {
    display: grid;
    flex: none;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: var(--radius-full);
    background: var(--alert-icon);
    color: var(--surface-page);
    font-size: var(--font-ui-label-font-size);
    font-weight: 700;
  }
  .alert__body { display: flex; flex: 1; flex-direction: column; gap: var(--spacing-stack-xs); }
  .alert__title {
    margin: 0;
    color: var(--text-default-heading);
    font-size: var(--font-ui-label-font-size);
    line-height: var(--font-ui-label-line-height);
    font-weight: 600;
  }
  .alert__text {
    margin: 0;
    font-size: var(--font-body-default-font-size);
    line-height: var(--font-body-default-line-height);
  }
  .alert__close {
    flex: none;
    width: 44px;
    height: 44px;
    margin: calc(var(--spacing-inset-sm) * -1) 0;
    border: 0;
    border-radius: var(--radius-full);
    background: transparent;
    color: var(--text-default-heading);
    font-size: var(--font-body-default-font-size);
    cursor: pointer;
  }
  .alert__close:hover { background: var(--surface-page-secondary); }
  .alert__close:focus-visible { outline: var(--border-width-md) solid var(--border-primary-focus); }
</style>
<div class="alert alert--error" role="alert">
  <span class="alert__icon" aria-hidden="true">!</span>
  <div class="alert__body">
    <p class="alert__title">Prenotazione non inviata</p>
    <p class="alert__text">Controlla la connessione e riprova. I dati che hai inserito sono ancora qui.</p>
  </div>
</div>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `alert--success`, `alert--warning`, `alert--error` | info | Type. No modifier gives the Info alert. |
| `role` | `status`, `alert` | `status` | `alert` for Errore and Attenzione, `status` for Info and Successo. |
| `.alert__close` | element | – | Optional close button. Needs `aria-label="Chiudi messaggio"`. |
| `.alert__title` | element | – | Short title. Always present, so the type is readable without colour. |

## Design tokens

```tokens
used: code
match: alert
```

## Accessibility

- **Announced.** `role="alert"` interrupts and reads the message at once (use for errors and warnings); `role="status"` waits for a pause. Add the role when the alert is inserted or its text changes.
- **Not by colour alone.** Each type has its own icon and a title. The border and background only reinforce it.
- **Close button.** A real `<button>` with `aria-label="Chiudi messaggio"`, 44px target, also closed with Esc when it has focus. Move the focus to a sensible place after closing.
- **Placement.** Put it before the content it refers to, so it is read first. For form errors, move the focus to the first field with an error and link the message with `aria-describedby`.
- **Contrast.** Title and message use the dark text tokens on a light surface: at least 4.5:1.

## Figma

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=164-19764

## Changelog

- `2026-11-11`: Page filled from the Figma library: four types, close option, usage, HTML code with tokens, props and accessibility.
