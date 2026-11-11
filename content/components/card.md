---
title: Card
group: Display
order: 10
type: component
status: Draft
description: A summary of one set or event: cover, tag, title, short text and a single action.
figma: https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=160-20141
---

## Overview

A card groups the information about **one** thing (a set, a mix, a live) in a block that can be scanned in a grid. It has a cover, a tag with the genre, a title, up to three lines of text and one action.

Use a card when people compare several items side by side. For a single long piece of content use a page section; for a list of many short rows, a list. A card is **not a link as a whole**: the only interactive element is the button, so there are no nested links and the focus order stays simple.

```html preview
<div class="ds-stage" style="align-items: flex-start;">
  <article class="card">
    <div class="card__cover card__cover--dark"><span class="card__art" role="img" aria-label="Vinile Locamimi"></span></div>
    <div class="card__body">
      <span class="card__tag">House / Soul</span>
      <h3 class="card__title">Soul thing</h3>
      <p class="card__text">Vecchi dischi e quella sensazione che arriva prima dei pensieri: il lato più morbido del mio groove.</p>
      <div class="card__action"><a class="card__button" href="#">Apri SoundCloud</a><span class="card__note">Si apre in una nuova scheda</span></div>
    </div>
  </article>
</div>
```

## Anatomy

```html preview
<div class="ds-stage">
  <span class="ds-anat" style="margin-left: 48px; margin-right: 48px;">
    <article class="card">
    <div class="card__cover card__cover--pink"><span class="card__art" role="img" aria-label="Vinile Locamimi"></span></div>
    <div class="card__body">
      <span class="card__tag">House / Soul</span>
      <h3 class="card__title">Soul thing</h3>
      <p class="card__text">Vecchi dischi e quella sensazione che arriva prima dei pensieri: il lato più morbido del mio groove.</p>
      <div class="card__action"><a class="card__button" href="#">Apri SoundCloud</a><span class="card__note">Si apre in una nuova scheda</span></div>
    </div>
  </article>
    <span class="ds-pin" style="top:-8px;left:-34px">1</span>
    <span class="ds-pin" style="top:90px;left:-34px">2</span>
    <span class="ds-pin" style="top:268px;left:-34px">3</span>
    <span class="ds-pin" style="top:296px;left:-34px">4</span>
    <span class="ds-pin" style="top:372px;left:-34px">5</span>
    <span class="ds-pin" style="top:412px;left:-34px">6</span>
  </span>
</div>
```

1. **Container.** `--surface-page`, `--radius-lg`, 16px padding, resting shadow `elevation/sm`.
2. **Cover.** Illustration on a toned surface, `--radius-md`. The tone (Scuro, Rosa, Lime) belongs to the set and stays the same wherever the set appears.
3. **Tag.** The genre or mood in one or two words, with the badge style.
4. **Title.** Maximum two lines, `font/heading/h4`.
5. **Text.** Maximum three lines (about 110 characters), `font/body/supporting`.
6. **Action.** One button that says what happens, plus a note when the link opens a new tab.

## Variants

Two orientations and three cover tones. **Vertical** (320px) for grids and mobile; **horizontal** (560px) for lists and featured events.

```html preview
<div class="ds-stage" style="align-items: flex-start;">
  <article class="card">
    <div class="card__cover card__cover--dark"><span class="card__art" role="img" aria-label="Vinile Locamimi"></span></div>
    <div class="card__body">
      <span class="card__tag">House / Soul</span>
      <h3 class="card__title">Soul thing</h3>
      <p class="card__text">Vecchi dischi e quella sensazione che arriva prima dei pensieri: il lato più morbido del mio groove.</p>
      <div class="card__action"><a class="card__button" href="#">Apri SoundCloud</a><span class="card__note">Si apre in una nuova scheda</span></div>
    </div>
  </article>
  <article class="card">
    <div class="card__cover card__cover--pink"><span class="card__art" role="img" aria-label="Vinile Locamimi"></span></div>
    <div class="card__body">
      <span class="card__tag">Percussioni / Groove</span>
      <h3 class="card__title">Groove</h3>
      <p class="card__text">Una selezione che gira intorno al ritmo: percussioni, incastri e il basso a seguire il corpo.</p>
      <div class="card__action"><a class="card__button" href="#">Apri SoundCloud</a><span class="card__note">Si apre in una nuova scheda</span></div>
    </div>
  </article>
  <article class="card">
    <div class="card__cover card__cover--lime"><span class="card__art" role="img" aria-label="Vinile Locamimi"></span></div>
    <div class="card__body">
      <span class="card__tag">Latin / House</span>
      <h3 class="card__title">Juicy Thursday</h3>
      <p class="card__text">I mood del giovedì, da portare con te. House e latin vibes per un aperitivo a tutta traccia.</p>
      <div class="card__action"><a class="card__button" href="#">Apri SoundCloud</a><span class="card__note">Si apre in una nuova scheda</span></div>
    </div>
  </article>
</div>
```

```html preview
<div class="ds-stage">
  <article class="card card--horizontal">
    <div class="card__cover card__cover--lime"><span class="card__art" role="img" aria-label="Vinile Locamimi"></span></div>
    <div class="card__body">
      <span class="card__tag">Ogni giovedì</span>
      <h3 class="card__title">Juicy Thursday · live</h3>
      <p class="card__text">Ogni giovedì dalle 19: set dal vivo, ospiti e il vinile che gira. Prenota il tuo posto.</p>
      <div class="card__action"><a class="card__button" href="#">Prenota il posto</a><span class="card__note">Si apre in una nuova scheda</span></div>
    </div>
  </article>
</div>
```

| Tone | Use it for |
| --- | --- |
| Scuro | The default set cover, when the white illustration needs the highest contrast. |
| Rosa | Main brand sets and featured items. |
| Lime | Live events and what is new. Use at most one lime card per row. |

## States

Default, hover and focus. Hover lifts the card with a larger shadow; focus draws a ring around the **whole card** when the button inside has the keyboard focus.

```html preview
<div class="ds-stage" style="align-items: flex-start;">
  <div class="ds-col"><article class="card">
    <div class="card__cover card__cover--pink"><span class="card__art" role="img" aria-label="Vinile Locamimi"></span></div>
    <div class="card__body">
      <span class="card__tag">Stato</span>
      <h3 class="card__title">Default</h3>
      <p class="card__text">Stato a riposo, ombra leggera.</p>
      <div class="card__action"><a class="card__button" href="#">Apri SoundCloud</a><span class="card__note">Si apre in una nuova scheda</span></div>
    </div>
  </article><span class="ds-cap">Default</span></div>
  <div class="ds-col"><article class="card is-hover">
    <div class="card__cover card__cover--pink"><span class="card__art" role="img" aria-label="Vinile Locamimi"></span></div>
    <div class="card__body">
      <span class="card__tag">Stato</span>
      <h3 class="card__title">Hover</h3>
      <p class="card__text">Il puntatore è sulla card: ombra più ampia.</p>
      <div class="card__action"><a class="card__button" href="#">Apri SoundCloud</a><span class="card__note">Si apre in una nuova scheda</span></div>
    </div>
  </article><span class="ds-cap">Hover</span></div>
  <div class="ds-col"><article class="card is-focus">
    <div class="card__cover card__cover--pink"><span class="card__art" role="img" aria-label="Vinile Locamimi"></span></div>
    <div class="card__body">
      <span class="card__tag">Stato</span>
      <h3 class="card__title">Focus</h3>
      <p class="card__text">Il focus è sul pulsante: anello sulla card.</p>
      <div class="card__action"><a class="card__button" href="#">Apri SoundCloud</a><span class="card__note">Si apre in una nuova scheda</span></div>
    </div>
  </article><span class="ds-cap">Focus</span></div>
</div>
```

## Usage

> [!DO]
> Keep one idea per card: one cover, one tag, one title and one action. Use the same tone for the same set everywhere (card, page, player).

> [!DONT]
> Don't make the whole card a link and put a button inside it: it creates two targets for the same destination. Don't add a second action or more than one tag.

> [!DO]
> In a grid, show three columns on desktop and one on mobile. If you need a carousel, show part of the next card, disable auto-advance and keep the arrows visible.

> [!DONT]
> Don't cut the title or the text with "…" without a way to read the rest, and don't put essential information only in the cover image.

## Code

```html component preview title="card.html"
<style>
  .card {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-stack-md);
    width: 320px;
    padding: var(--spacing-inset-md);
    border-radius: var(--radius-lg);
    background: var(--surface-page);
    box-shadow: var(--elevation-sm-offset-x) var(--elevation-sm-offset-y) var(--elevation-sm-blur) var(--elevation-sm-spread) var(--elevation-sm-color);
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
    transition: box-shadow 150ms ease;
  }
  .card--horizontal { flex-direction: row; align-items: flex-start; width: 560px; }
  .card:hover,
  .card.is-hover {
    box-shadow: var(--elevation-lg-offset-x) var(--elevation-lg-offset-y) var(--elevation-lg-blur) var(--elevation-lg-spread) var(--elevation-lg-color);
  }
  .card:focus-within,
  .card.is-focus { outline: var(--border-width-md) solid var(--border-primary-focus); outline-offset: var(--border-width-md); }
  .card__cover {
    --cover: var(--text-default-heading);
    display: grid;
    place-items: center;
    height: 240px;
    border-radius: var(--radius-md);
    background: var(--cover);
  }
  .card--horizontal .card__cover { flex: none; width: 200px; height: 200px; }
  .card__cover--dark { --cover: var(--text-default-heading); }
  .card__cover--pink { --cover: var(--surface-primary-default); }
  .card__cover--lime { --cover: var(--surface-accent-default); }
  /* --card-art: url(...) of the cover illustration, white SVG */
  .card__art { width: 180px; height: 180px; background: var(--card-art) center / contain no-repeat; }
  .card--horizontal .card__art { width: 140px; height: 140px; }
  .card__body { display: flex; flex: 1; flex-direction: column; align-items: flex-start; gap: var(--spacing-card-header-content); }
  .card__tag {
    padding: var(--spacing-tag-badge-inset-vertical-compact) var(--spacing-tag-badge-inset-horizontal);
    border-radius: var(--radius-full);
    background: var(--surface-page-secondary);
    color: var(--text-default-body);
    font-size: var(--font-ui-label-font-size);
    line-height: var(--font-ui-label-line-height);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .card__title {
    margin: 0;
    color: var(--text-default-heading);
    font-size: var(--font-heading-h4-font-size);
    line-height: var(--font-heading-h4-line-height);
    font-weight: 600;
  }
  .card__text {
    margin: 0;
    color: var(--text-default-body);
    font-size: var(--font-body-supporting-font-size);
    line-height: var(--font-body-supporting-line-height);
  }
  .card__action { display: flex; flex-direction: column; align-items: flex-start; gap: var(--spacing-stack-xs); padding-top: var(--spacing-stack-sm); }
  .card__note { color: var(--text-default-caption); font-size: var(--font-caption-font-size); line-height: var(--font-caption-line-height); }
  /* Same look as the Button component */
  .card__button {
    display: inline-flex;
    min-height: 44px;
    padding: var(--spacing-button-inset-vertical) var(--spacing-button-inset-horizontal);
    align-items: center;
    border-radius: var(--radius-full);
    background: var(--surface-primary-default);
    color: var(--text-primary-default-on-colour);
    font-size: var(--font-ui-button-font-size);
    line-height: var(--font-ui-button-line-height);
    font-weight: 500;
    text-decoration: none;
  }
  .card__button:hover { background: var(--surface-primary-default-hover); }
  .card__button:focus-visible { outline: var(--border-width-md) solid var(--border-primary-focus); outline-offset: var(--border-width-md); }
  @media (max-width: 640px) { .card--horizontal { flex-direction: column; width: 100%; } .card--horizontal .card__cover { width: 100%; } }
</style>
<article class="card">
  <div class="card__cover card__cover--pink"><span class="card__art" role="img" aria-label="Vinile Locamimi"></span></div>
  <div class="card__body">
    <span class="card__tag">House / Soul</span>
    <h3 class="card__title">Soul thing</h3>
    <p class="card__text">Vecchi dischi e quella sensazione che arriva prima dei pensieri.</p>
    <div class="card__action">
      <a class="card__button" href="https://soundcloud.com/" target="_blank" rel="noopener">Apri SoundCloud</a>
      <span class="card__note">Si apre in una nuova scheda</span>
    </div>
  </div>
</article>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `card--horizontal` | class | vertical | Horizontal layout, 560px, cover on the left. Falls back to vertical under 640px. |
| `card__cover--dark`, `--pink`, `--lime` | class | dark | Cover tone. One tone per set. |
| `--card-art` | CSS variable | vinyl fox | `url(...)` of the white cover illustration. Set it on `:root` or on the card. |
| `card__tag` | element | – | Genre or mood. Optional: remove it when the card has no tag. |
| `card__action` | element | – | The only action. Optional for informational cards. |
| `is-hover`, `is-focus` | class | – | Only to show a state in documentation. |

## Design tokens

```tokens
used: code
match: card
```

## Accessibility

- **Structure.** Use `<article>` with a heading (`<h3>`, adjust the level to the page) so screen reader users can jump from card to card.
- **One interactive element.** The button is the only focus stop. The card is not a link, so there are no nested interactive elements.
- **Focus.** `:focus-within` draws a 2px ring in `--border-primary-focus` around the whole card.
- **Cover image.** The illustration is decorative or descriptive: give it `role="img"` with an `aria-label` ("Vinile Locamimi, tono rosa"), or `aria-hidden="true"` if it adds nothing.
- **External links.** Say it in the note ("Si apre in una nuova scheda") and use `rel="noopener"`.
- **Target size.** The button is at least 44px high; the whole card never needs to be hit.

## Figma

https://www.figma.com/design/CjSPlGx6zYgsUuCU58YOom/Untitled?node-id=160-20141

## Changelog

- `2026-11-11`: Page filled from the Figma library: two orientations, three cover tones, three states, usage, HTML code with tokens, props and accessibility. Added the default cover `assets/images/card/vinyl-fox.svg`.
