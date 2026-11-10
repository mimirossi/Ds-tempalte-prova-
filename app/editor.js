/*
 * Site editor: add and change page content from the site itself.
 * Changes are saved to the GitHub repository with the editor's own GitHub access,
 * so no Markdown and no GitHub screens are needed after the first sign-in.
 */
(function () {
  "use strict";

  const API = "https://api.github.com";
  const TOKEN_KEY = "ds-github-token";
  const DRAFT_KEY = "ds-draft:";
  const DRAFT_MAX_AGE = 15 * 60 * 1000;

  const D = () => window.DS;
  const el = (tag, attrs, html) => D().el(tag, attrs, html);
  const esc = (s) => D().esc(s);
  const $ = (sel, root) => (root || document).querySelector(sel);

  /* ---------- GitHub ---------- */

  const token = () => {
    try {
      return localStorage.getItem(TOKEN_KEY) || "";
    } catch (e) {
      return "";
    }
  };

  const repoPath = () => "/repos/" + D().repo().owner + "/" + D().repo().name;

  async function gh(path, options) {
    options = options || {};
    const res = await fetch(API + path, {
      method: options.method || "GET",
      headers: Object.assign(
        { Accept: options.raw ? "application/vnd.github.raw+json" : "application/vnd.github+json", Authorization: "Bearer " + (options.token || token()) },
        options.body ? { "Content-Type": "application/json" } : {}
      ),
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });
    if (!res.ok) {
      const error = new Error("GitHub answered " + res.status);
      error.status = res.status;
      throw error;
    }
    return options.raw ? res.text() : res.json();
  }

  /** One commit with every changed file. `files`: [{ path, text }] or [{ path, base64 }]. */
  async function commit(message, files) {
    const ref = await gh(repoPath() + "/git/ref/heads/" + D().branch());
    const parent = await gh(repoPath() + "/git/commits/" + ref.object.sha);
    const tree = [];
    for (const file of files) {
      if (file.base64 != null) {
        const blob = await gh(repoPath() + "/git/blobs", { method: "POST", body: { content: file.base64, encoding: "base64" } });
        tree.push({ path: file.path, mode: "100644", type: "blob", sha: blob.sha });
      } else {
        tree.push({ path: file.path, mode: "100644", type: "blob", content: file.text });
      }
    }
    const newTree = await gh(repoPath() + "/git/trees", { method: "POST", body: { base_tree: parent.tree.sha, tree } });
    const made = await gh(repoPath() + "/git/commits", { method: "POST", body: { message, tree: newTree.sha, parents: [ref.object.sha] } });
    await gh(repoPath() + "/git/refs/heads/" + D().branch(), { method: "PATCH", body: { sha: made.sha } });
  }

  /** The page as it is in the repository right now (the published site can be a minute behind). */
  async function readPage(slug) {
    try {
      return await gh(repoPath() + "/contents/content/" + slug + ".md?ref=" + encodeURIComponent(D().branch()), { raw: true });
    } catch (e) {
      if (e.status === 404) return null;
      throw e;
    }
  }

  function explain(error) {
    if (error.status === 401) return "Your GitHub access is no longer valid. Sign in again.";
    if (error.status === 403 || error.status === 404) return "Your GitHub access does not allow changes to this repository.";
    if (error.status === 409 || error.status === 422) return "Someone else saved at the same moment. Close this panel, reload the page and try again.";
    return "Could not save (" + error.message + "). Check the connection and try again.";
  }

  /* ---------- Drafts: what was just saved, shown until the site republishes ---------- */

  function draftFor(slug, published) {
    try {
      const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY + slug) || "null");
      if (!saved) return null;
      if (saved.text === published || Date.now() - saved.time > DRAFT_MAX_AGE) {
        sessionStorage.removeItem(DRAFT_KEY + slug);
        return null;
      }
      return saved.text;
    } catch (e) {
      return null;
    }
  }

  function setDraft(slug, text) {
    try {
      sessionStorage.setItem(DRAFT_KEY + slug, JSON.stringify({ text, time: Date.now() }));
    } catch (e) {}
  }

  /* ---------- Page text <-> sections <-> blocks ---------- */

  /** Splits a page into its frontmatter, the intro and one part per "## Section". */
  function splitPage(src) {
    const m = /^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n?/.exec(src);
    const front = m ? m[0].replace(/\s*$/, "") : "";
    const sections = [{ title: null, lines: [] }];
    let fence = null;
    (m ? src.slice(m[0].length) : src).split(/\r?\n/).forEach((line) => {
      const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
      if (f) {
        if (!fence) fence = f[1];
        else if (f[1][0] === fence[0] && f[1].length >= fence.length && /^\s{0,3}[`~]+\s*$/.test(line)) fence = null;
      }
      const h = !fence && /^##\s+(.+?)\s*$/.exec(line);
      if (h) sections.push({ title: h[1], lines: [] });
      else sections[sections.length - 1].lines.push(line);
    });
    return { front, sections: sections.map((s) => ({ title: s.title, text: s.lines.join("\n").trim() })) };
  }

  function joinPage(page) {
    const parts = [];
    if (page.front) parts.push(page.front);
    page.sections.forEach((s) => {
      if (s.title == null) {
        if (s.text) parts.push(s.text);
      } else parts.push("## " + s.title + (s.text ? "\n\n" + s.text : ""));
    });
    return parts.join("\n\n") + "\n";
  }

  function setFrontmatter(front, values) {
    const lines = front ? front.split(/\r?\n/).slice(1, -1) : [];
    Object.keys(values).forEach((key) => {
      const value = String(values[key] == null ? "" : values[key]).replace(/\r?\n/g, " ").trim();
      const i = lines.findIndex((line) => new RegExp("^" + key + "\\s*:").test(line));
      if (i >= 0) lines[i] = key + ": " + value;
      else if (value) lines.push(key + ": " + value);
    });
    return "---\n" + lines.join("\n") + "\n---";
  }

  const CALLOUT = /^>\s*\[!(TODO|DO|DONT|NOTE|WARNING)\]/i;
  const IMAGE = /^!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"([^"]*)")?\s*\)\s*$/;
  const FIGMA = /^<?(https:\/\/(?:www\.)?figma\.com\/\S+?)>?$/;

  /** Turns a section's Markdown into the blocks the editor shows. */
  function toBlocks(text) {
    const blocks = [];
    const addText = (raw) => {
      const last = blocks[blocks.length - 1];
      if (last && last.type === "text") last.text += "\n\n" + raw;
      else blocks.push({ type: "text", text: raw });
    };
    marked.lexer(text).forEach((t) => {
      const raw = t.raw.replace(/\s+$/, "");
      if (t.type === "space" || !raw) return;
      if (t.type === "code" && /^\s{0,3}(`{3,}|~{3,})/.test(raw)) {
        const info = D().parseInfo(t.lang);
        const code = info.pasted ? t.lang + "\n" + t.text : t.text;
        if (info.lang === "tokens") return blocks.push({ type: "tokens", text: code });
        const guess = info.pasted || !info.lang ? D().detectCode(code) : info;
        blocks.push({ type: "code", text: code, lang: guess.lang || "", preview: !!guess.preview, component: !!guess.component, tab: info.tab, title: info.title });
      } else if (t.type === "blockquote" && CALLOUT.test(raw)) {
        const kind = CALLOUT.exec(raw)[1].toUpperCase();
        const body = raw.replace(CALLOUT, "").split(/\r?\n/).map((line) => line.replace(/^>\s?/, "")).join("\n").trim();
        blocks.push({ type: "callout", kind, text: body });
      } else if (t.type === "paragraph" && IMAGE.test(raw)) {
        const m = IMAGE.exec(raw);
        blocks.push({ type: "image", alt: m[1], path: m[2], caption: m[3] || "" });
      } else if (t.type === "paragraph" && FIGMA.test(raw)) {
        blocks.push({ type: "figma", url: FIGMA.exec(raw)[1] });
      } else if (t.type === "html" && /^<svg[\s>]/i.test(raw)) {
        blocks.push({ type: "svg", text: raw });
      } else addText(raw);
    });
    return blocks;
  }

  function fence(text) {
    const longest = (text.match(/`+/g) || []).reduce((n, run) => Math.max(n, run.length), 0);
    return "`".repeat(Math.max(3, longest + 1));
  }

  /** Blocks back to Markdown. */
  function toMarkdown(blocks) {
    return blocks
      .map((b) => {
        if (b.type === "text") return b.text.trim();
        if (b.type === "callout") return b.text.trim() ? "> [!" + b.kind + "]\n" + b.text.trim().split(/\r?\n/).map((line) => ("> " + line).trimEnd()).join("\n") : "";
        if (b.type === "image") return b.path ? "![" + b.alt.replace(/[\[\]]/g, "") + "](" + b.path + (b.caption ? ' "' + b.caption.replace(/"/g, "'") + '"' : "") + ")" : "";
        if (b.type === "figma") return b.url.trim();
        if (b.type === "svg") return b.text.trim().replace(/\n\s*\n/g, "\n"); // a blank line would end the drawing
        if (b.type === "tokens") return "```tokens\n" + b.text.trim() + "\n```";
        if (b.type === "code") {
          const code = b.text.replace(/\s+$/, "");
          if (!code.trim()) return "";
          const lang = b.lang || D().detectCode(code).lang || "text";
          const info = [lang, b.component ? "component" : "", b.preview ? "preview" : "", b.tab ? 'tab="' + b.tab + '"' : "", b.title ? 'title="' + b.title + '"' : ""].filter(Boolean).join(" ");
          const marks = fence(code);
          return marks + info + "\n" + code + "\n" + marks;
        }
        return "";
      })
      .filter(Boolean)
      .join("\n\n");
  }

  /* ---------- Panel ---------- */

  let panel = null;

  function closePanel() {
    if (panel) panel.remove();
    panel = null;
    document.body.classList.remove("editor-open");
  }

  function openPanel(title, subtitle) {
    closePanel();
    panel = el("div", { class: "editor", role: "dialog", "aria-modal": "true", "aria-label": title });
    panel.innerHTML =
      '<div class="editor-scrim"></div><div class="editor-panel"><header class="editor-head"><div><p class="editor-kicker">' + esc(subtitle || "") +
      "</p><h2>" + esc(title) + '</h2></div><button type="button" class="icon-btn" data-close aria-label="Close">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></header>' +
      '<div class="editor-body"></div><footer class="editor-foot"><p class="editor-status" role="status"></p><div class="editor-actions"></div></footer></div>';
    panel.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) closePanel();
    });
    document.body.appendChild(panel);
    document.body.classList.add("editor-open");
    return { body: $(".editor-body", panel), actions: $(".editor-actions", panel), status: $(".editor-status", panel) };
  }

  function button(label, kind) {
    return el("button", { type: "button", class: "editor-btn" + (kind ? " " + kind : "") }, esc(label));
  }

  function field(label, control, hint) {
    const wrap = el("label", { class: "editor-field" }, "<span>" + esc(label) + "</span>");
    wrap.appendChild(control);
    if (hint) wrap.appendChild(el("small", {}, esc(hint)));
    return wrap;
  }

  function input(value, onChange, attrs) {
    const node = el("input", Object.assign({ type: "text" }, attrs || {}));
    node.value = value || "";
    node.addEventListener("input", () => onChange(node.value));
    return node;
  }

  function textarea(value, onChange, rows, mono) {
    const node = el("textarea", { rows: rows || 4, class: mono ? "mono" : "", spellcheck: mono ? "false" : "true" });
    node.value = value || "";
    node.addEventListener("input", () => onChange(node.value));
    return node;
  }

  function select(value, options, onChange) {
    const node = el("select");
    options.forEach((o) => node.appendChild(el("option", { value: o[0] }, esc(o[1]))));
    if (!options.some((o) => o[0] === value)) node.appendChild(el("option", { value }, esc(value)));
    node.value = value;
    node.addEventListener("change", () => onChange(node.value));
    return node;
  }

  function checkbox(label, value, onChange) {
    const wrap = el("label", { class: "editor-check" });
    const node = el("input", { type: "checkbox" });
    node.checked = !!value;
    node.addEventListener("change", () => onChange(node.checked));
    wrap.appendChild(node);
    wrap.appendChild(el("span", {}, esc(label)));
    return wrap;
  }

  /* ---------- Sign in ---------- */

  function signIn() {
    return new Promise((resolve) => {
      const repo = D().repo();
      const ui = openPanel("Sign in to edit", "One time only");
      const create =
        "https://github.com/settings/personal-access-tokens/new?name=" + encodeURIComponent("Design system editor") +
        "&description=" + encodeURIComponent("Lets the design system site save changes") + "&contents=write";
      ui.body.innerHTML =
        "<p>To save changes, the site needs your permission to write to the repository <strong>" + esc(repo.owner + "/" + repo.name) +
        "</strong>. You give it once with an access code from GitHub.</p><ol class=\"editor-steps\">" +
        '<li><a href="' + create + '" target="_blank" rel="noopener">Open the access code page on GitHub</a> and sign in.</li>' +
        "<li>Under <strong>Repository access</strong> choose <strong>Only select repositories</strong> and pick <strong>" + esc(repo.name) + "</strong>.</li>" +
        "<li>Under <strong>Permissions → Repository permissions</strong> set <strong>Contents</strong> to <strong>Read and write</strong>.</li>" +
        "<li>Press <strong>Generate token</strong>, copy the code and paste it below.</li></ol>";
      let value = "";
      const box = input("", (v) => (value = v.trim()), { type: "password", placeholder: "github_pat_…", autocomplete: "off" });
      ui.body.appendChild(field("Access code", box, "It is kept in this browser only and is sent to GitHub alone."));
      const ok = button("Sign in", "primary");
      ui.actions.appendChild(ok);
      ok.addEventListener("click", async () => {
        if (!value) return (ui.status.textContent = "Paste the access code first.");
        ok.disabled = true;
        ui.status.textContent = "Checking…";
        try {
          const info = await gh(repoPath(), { token: value });
          if (!info.permissions || !info.permissions.push) throw Object.assign(new Error("read only"), { status: 403 });
          localStorage.setItem(TOKEN_KEY, value);
          closePanel();
          resolve(true);
        } catch (e) {
          ok.disabled = false;
          ui.status.textContent =
            e.status === 401 ? "GitHub did not accept this code. Copy it again and paste it whole."
            : e.status === 403 || e.status === 404 ? "This code cannot write to " + repo.name + ". Check steps 2 and 3."
            : "Could not reach GitHub. Check the connection and try again.";
        }
      });
      box.focus();
    });
  }

  async function ready() {
    return token() ? true : signIn();
  }

  function signOut() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {}
    D().toast("Signed out");
  }

  /* ---------- Block editor ---------- */

  const LANGS = [["", "Detect automatically"], ["tsx", "React"], ["html", "HTML"], ["css", "CSS"], ["svg", "SVG"], ["javascript", "JavaScript"], ["json", "JSON"], ["bash", "Terminal"], ["text", "Plain text"]];
  const KINDS = [["TODO", "Placeholder: what is still missing"], ["DO", "Do"], ["DONT", "Don't"], ["NOTE", "Note"], ["WARNING", "Warning"]];
  const NAMES = { text: "Text", image: "Image", code: "Code", svg: "SVG drawing", figma: "Figma link", callout: "Box", tokens: "Token table" };

  function blockCard(block, slug) {
    const card = el("div", { class: "editor-block" + (block.type === "callout" && block.kind === "TODO" ? " is-todo" : "") });
    const body = el("div", { class: "editor-block-body" });
    if (block.type === "text") {
      body.appendChild(textarea(block.text, (v) => (block.text = v), 5));
      body.appendChild(el("small", {}, "Leave an empty line between paragraphs. Start a line with “- ” for a list, with “### ” for a small heading."));
    } else if (block.type === "callout") {
      body.appendChild(field("Kind", select(block.kind, KINDS, (v) => {
        block.kind = v;
        card.classList.toggle("is-todo", v === "TODO");
      })));
      body.appendChild(textarea(block.text, (v) => (block.text = v), 3));
      if (block.kind === "TODO") body.appendChild(el("small", {}, "Delete this placeholder once the real content is in."));
    } else if (block.type === "image") {
      const preview = el("div", { class: "editor-image" });
      const show = (src) => (preview.innerHTML = src ? '<img alt="" src="' + esc(src) + '">' : "<span>No file chosen</span>");
      show(block.path && !block.file ? block.path : "");
      const img = $("img", preview);
      if (img) img.addEventListener("error", () => (preview.innerHTML = "<span>Not uploaded yet: choose the file</span>"));
      const file = el("input", { type: "file", accept: "image/*" });
      file.addEventListener("change", () => {
        block.file = file.files[0] || null;
        if (!block.file) return;
        const name = block.file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
        block.path = D().imageDir(slug) + "/" + name;
        if (!block.alt) block.alt = block.file.name.replace(/\.\w+$/, "").replace(/[-_]+/g, " ");
        show(URL.createObjectURL(block.file));
      });
      body.appendChild(preview);
      body.appendChild(field("File", file));
      body.appendChild(field("Description", input(block.alt, (v) => (block.alt = v)), "What the image shows, for people who cannot see it."));
      body.appendChild(field("Caption (optional)", input(block.caption, (v) => (block.caption = v))));
    } else if (block.type === "code") {
      body.appendChild(textarea(block.text, (v) => (block.text = v), 9, true));
      const row = el("div", { class: "editor-row" });
      row.appendChild(field("Language", select(block.lang, LANGS, (v) => (block.lang = v))));
      row.appendChild(checkbox("Show it rendered (Preview tab)", block.preview, (v) => (block.preview = v)));
      row.appendChild(checkbox("Full component: other previews on this page can use it (React component, or the CSS of an HTML block)", block.component, (v) => (block.component = v)));
      body.appendChild(row);
    } else if (block.type === "svg") {
      body.appendChild(textarea(block.text, (v) => (block.text = v), 7, true));
      body.appendChild(el("small", {}, "Paste the SVG copied from Figma (Copy as SVG). It is shown as a drawing."));
    } else if (block.type === "figma") {
      body.appendChild(field("Link", input(block.url, (v) => (block.url = v), { placeholder: "https://www.figma.com/design/…" }), "In Figma: right-click the component → Copy link to selection."));
    } else if (block.type === "tokens") {
      body.appendChild(textarea(block.text, (v) => (block.text = v), 3, true));
      body.appendChild(el("small", {}, "“used: code” lists the tokens used on this page. “file:” and “path:” show a token file."));
    }
    const head = el("div", { class: "editor-block-head" }, "<strong>" + esc(NAMES[block.type] || block.type) + "</strong>");
    const tools = el("span", { class: "editor-tools" });
    [["up", "Move up", "M6 15l6-6 6 6"], ["down", "Move down", "M6 9l6 6 6-6"], ["delete", "Delete", "M6 6l12 12M18 6 6 18"]].forEach((t) => {
      tools.appendChild(el("button", { type: "button", class: "icon-btn", "data-act": t[0], "aria-label": t[1], title: t[1] }, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + t[2] + '"/></svg>'));
    });
    head.appendChild(tools);
    card.appendChild(head);
    card.appendChild(body);
    return card;
  }

  const NEW = [
    ["Text", () => ({ type: "text", text: "" })],
    ["Image", () => ({ type: "image", alt: "", path: "", caption: "" })],
    ["Code", () => ({ type: "code", text: "", lang: "", preview: true, component: false, tab: "", title: "" })],
    ["SVG", () => ({ type: "svg", text: "" })],
    ["Figma link", () => ({ type: "figma", url: "" })],
    ["Do", () => ({ type: "callout", kind: "DO", text: "" })],
    ["Don't", () => ({ type: "callout", kind: "DONT", text: "" })],
    ["Note", () => ({ type: "callout", kind: "NOTE", text: "" })],
  ];

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = () => reject(new Error("could not read " + file.name));
      reader.readAsDataURL(file);
    });
  }

  /** Opens the editor on one section of a page. `sectionTitle` null = the introduction. */
  async function editSection(slug, sectionTitle, pageTitle) {
    if (!(await ready())) return;
    const ui = openPanel(sectionTitle || "Introduction", pageTitle || slug);
    ui.body.innerHTML = '<p class="muted">Loading…</p>';
    let source;
    try {
      source = await readPage(slug);
    } catch (e) {
      ui.body.innerHTML = '<p class="editor-error">' + esc(explain(e)) + "</p>";
      if (e.status === 401) signOut();
      return;
    }
    if (source == null) return (ui.body.innerHTML = '<p class="editor-error">This page is not in the repository yet. Wait a minute and try again.</p>');

    const page = splitPage(source);
    let section = page.sections.find((s) => (s.title == null ? sectionTitle == null : sectionTitle != null && D().norm(s.title) === D().norm(sectionTitle)));
    if (!section) {
      section = { title: sectionTitle, text: "" };
      page.sections.push(section);
    }
    const blocks = toBlocks(section.text);

    const draw = () => {
      ui.body.innerHTML = "";
      if (!blocks.length) ui.body.appendChild(el("p", { class: "muted" }, "This section is empty. Add the first block below."));
      blocks.forEach((block, i) => {
        const card = blockCard(block, slug);
        card.addEventListener("click", (e) => {
          const act = e.target.closest("[data-act]");
          if (!act) return;
          const kind = act.dataset.act;
          if (kind === "delete") blocks.splice(i, 1);
          else {
            const j = kind === "up" ? i - 1 : i + 1;
            if (j < 0 || j >= blocks.length) return;
            blocks.splice(j, 0, blocks.splice(i, 1)[0]);
          }
          draw();
        });
        ui.body.appendChild(card);
      });
      const add = el("div", { class: "editor-add" }, "<span>Add</span>");
      NEW.forEach((item) => {
        const b = button(item[0]);
        b.addEventListener("click", () => {
          blocks.push(item[1]());
          draw();
          const cards = ui.body.querySelectorAll(".editor-block");
          const last = cards[cards.length - 1];
          last.scrollIntoView({ behavior: "smooth", block: "center" });
          const first = last.querySelector("textarea, input:not([type=checkbox])");
          if (first) first.focus();
        });
        add.appendChild(b);
      });
      ui.body.appendChild(add);
    };
    draw();

    const cancel = button("Cancel");
    cancel.setAttribute("data-close", "");
    const save = button("Save", "primary");
    ui.actions.appendChild(cancel);
    ui.actions.appendChild(save);
    save.addEventListener("click", async () => {
      const figma = blocks.find((b) => b.type === "figma" && b.url.trim() && !FIGMA.test(b.url.trim()));
      if (figma) return (ui.status.textContent = "The Figma link must start with https://www.figma.com/");
      if (blocks.some((b) => b.type === "image" && !b.path)) return (ui.status.textContent = "Choose a file for the image, or delete that block.");
      save.disabled = true;
      ui.status.textContent = "Saving…";
      try {
        const files = [];
        for (const block of blocks) {
          if (block.type === "image" && block.file) files.push({ path: block.path, base64: await fileToBase64(block.file) });
        }
        section.text = toMarkdown(blocks);
        const text = joinPage(page);
        files.push({ path: "content/" + slug + ".md", text });
        await commit("Update " + (pageTitle || slug) + ": " + (sectionTitle || "introduction"), files);
        setDraft(slug, text);
        closePanel();
        await D().route();
        const heading = sectionTitle && document.getElementById(D().slugify(sectionTitle));
        if (heading) heading.scrollIntoView();
        D().toast("Saved");
      } catch (e) {
        save.disabled = false;
        ui.status.textContent = explain(e);
        if (e.status === 401) signOut();
      }
    });
  }

  /* ---------- Page settings and new pages ---------- */

  const STATUS = [["", "None"], ["Draft", "Draft"], ["Beta", "Beta"], ["Stable", "Stable"], ["Deprecated", "Deprecated"]];

  function groupInput(value, onChange) {
    const id = "editor-groups";
    const node = input(value, onChange, { list: id });
    const list = el("datalist", { id });
    const names = new Set((D().config.groups || []).concat(D().manifest.pages.map((p) => p.group).filter(Boolean)));
    names.forEach((name) => list.appendChild(el("option", { value: name })));
    const wrap = el("span", { class: "editor-wrap" });
    wrap.appendChild(node);
    wrap.appendChild(list);
    return wrap;
  }

  async function editSettings(slug, pageTitle) {
    if (!(await ready())) return;
    const ui = openPanel("Page settings", pageTitle || slug);
    ui.body.innerHTML = '<p class="muted">Loading…</p>';
    let source;
    try {
      source = await readPage(slug);
    } catch (e) {
      return (ui.body.innerHTML = '<p class="editor-error">' + esc(explain(e)) + "</p>");
    }
    if (source == null) return (ui.body.innerHTML = '<p class="editor-error">This page is not in the repository yet. Wait a minute and try again.</p>');
    const page = splitPage(source);
    const v = D().parseFrontmatter(source).data;
    const values = { title: v.title || "", description: v.description || "", status: v.status || "", figma: v.figma || "", group: v.group || "", order: v.order || "" };
    ui.body.innerHTML = "";
    ui.body.appendChild(field("Title", input(values.title, (x) => (values.title = x))));
    ui.body.appendChild(field("Description", textarea(values.description, (x) => (values.description = x), 2), "One sentence, shown under the title and on the overview."));
    if (slug !== "index") {
      ui.body.appendChild(field("Status", select(values.status, STATUS, (x) => (values.status = x))));
      ui.body.appendChild(field("Figma link", input(values.figma, (x) => (values.figma = x), { placeholder: "https://www.figma.com/design/…" }), "Adds an “Open in Figma” button."));
      ui.body.appendChild(field("Menu section", groupInput(values.group, (x) => (values.group = x)), "Where the page sits in the side menu. A new name creates a new section."));
      ui.body.appendChild(field("Position", input(String(values.order), (x) => (values.order = x), { type: "number" }), "Lower numbers come first."));
    }
    const cancel = button("Cancel");
    cancel.setAttribute("data-close", "");
    const save = button("Save", "primary");
    ui.actions.appendChild(cancel);
    ui.actions.appendChild(save);
    save.addEventListener("click", async () => {
      if (!values.title.trim()) return (ui.status.textContent = "The page needs a title.");
      save.disabled = true;
      ui.status.textContent = "Saving…";
      try {
        page.front = setFrontmatter(page.front, slug === "index" ? { title: values.title, description: values.description } : values);
        const text = joinPage(page);
        await commit("Update settings of " + values.title, [{ path: "content/" + slug + ".md", text }]);
        setDraft(slug, text);
        const meta = D().manifest.pages.find((p) => p.slug === slug);
        if (meta) Object.assign(meta, { title: values.title, description: values.description, group: slug === "index" ? "" : values.group || "Pages", order: Number(values.order) || 999 });
        closePanel();
        await D().route();
        D().toast("Saved");
      } catch (e) {
        save.disabled = false;
        ui.status.textContent = explain(e);
        if (e.status === 401) signOut();
      }
    });
  }

  /** `item` is one entry of "newPage" in site.config.json. */
  async function newPage(item) {
    if (!(await ready())) return;
    const isComponent = /component/i.test(item.template);
    const ui = openPanel(item.label, "New page");
    const values = { title: "", group: isComponent ? "" : "Foundations", description: "" };
    ui.body.appendChild(field("Name", input("", (x) => (values.title = x), { placeholder: isComponent ? "Tooltip" : "Motion" })));
    ui.body.appendChild(field("Menu section", groupInput(values.group, (x) => (values.group = x)), "Where the page sits in the side menu. A new name creates a new section."));
    ui.body.appendChild(field("Description", textarea("", (x) => (values.description = x), 2), "One sentence on what it is."));
    const cancel = button("Cancel");
    cancel.setAttribute("data-close", "");
    const save = button("Create page", "primary");
    ui.actions.appendChild(cancel);
    ui.actions.appendChild(save);
    save.addEventListener("click", async () => {
      const title = values.title.trim();
      const name = D().slugify(title);
      if (!name) return (ui.status.textContent = "Give the page a name.");
      const slug = item.folder.replace(/^content\//, "") + "/" + name;
      if (D().manifest.pages.some((p) => p.slug === slug)) return (ui.status.textContent = "A page with this name already exists.");
      const template = D().templates[item.template];
      if (!template) return (ui.status.textContent = "The page template could not be loaded. Reload and try again.");
      save.disabled = true;
      ui.status.textContent = "Creating…";
      try {
        if ((await readPage(slug)) != null) throw Object.assign(new Error("exists"), { exists: true });
        const page = splitPage(
          template
            .replace(/^#.*\r?\n/gm, (line) => (/^#\s*group:/.test(line) ? "" : line))
            .replace(/(Component|Foundation) name/g, title)
            .replace(/(component|foundation)-name/g, name)
        );
        page.front = setFrontmatter(page.front, { title, group: values.group.trim() || (isComponent ? "Components" : "Foundations"), description: values.description });
        const text = joinPage(page);
        await commit("Add page: " + title, [{ path: "content/" + slug + ".md", text }]);
        setDraft(slug, text);
        D().manifest.pages.push({ slug, title, group: values.group.trim() || (isComponent ? "Components" : "Foundations"), order: 999, type: isComponent ? "component" : "foundation", description: values.description, status: "Draft", placeholders: 0 });
        closePanel();
        location.hash = "#/" + slug;
        D().toast("Page created");
      } catch (e) {
        save.disabled = false;
        ui.status.textContent = e.exists ? "A page with this name already exists." : explain(e);
        if (e.status === 401) signOut();
      }
    });
  }

  /* ---------- Hooks into the rendered page ---------- */

  function sectionOf(node, content) {
    while (node && node.parentElement !== content) node = node.parentElement;
    for (; node; node = node.previousElementSibling) if (node.tagName === "H2") return node.dataset.title || node.textContent.trim();
    return null;
  }

  function decorate(article, slug, page) {
    const content = $(".content", article);
    if (!content) return;
    content.querySelectorAll("h2").forEach((h) => {
      const title = h.textContent.trim();
      h.dataset.title = title;
      const b = el("button", { type: "button", class: "section-edit edit-only" }, D().ICON.edit + "<span>Edit</span>");
      b.addEventListener("click", () => editSection(slug, title, page.title));
      h.appendChild(b);
    });
    // Placeholder links open the editor on their section instead of GitHub.
    content.addEventListener("click", (e) => {
      const link = e.target.closest(".todo-head a, .img-missing a");
      if (!link || /\/upload\/[^/]+\/tokens$/.test(link.getAttribute("href") || "")) return;
      e.preventDefault();
      editSection(slug, sectionOf(link, content), page.title);
    });
    const bar = $(".edit-bar", article) || $(".page-header", article).appendChild(el("div", { class: "edit-bar" }));
    const settings = el("a", { href: "#", class: "edit-only" }, D().ICON.edit + "Page settings");
    settings.addEventListener("click", (e) => {
      e.preventDefault();
      editSettings(slug, page.title);
    });
    const intro = el("a", { href: "#", class: "edit-only" }, D().ICON.plus + "Edit introduction");
    intro.addEventListener("click", (e) => {
      e.preventDefault();
      editSection(slug, null, page.title);
    });
    bar.prepend(settings);
    if (!content.querySelector("h2:not(.section-missing)") || (content.firstElementChild && content.firstElementChild.tagName !== "H2")) bar.prepend(intro);
    if (token()) {
      const out = el("a", { href: "#", class: "edit-only" }, "Sign out");
      out.addEventListener("click", (e) => {
        e.preventDefault();
        signOut();
        out.remove();
      });
      bar.appendChild(out);
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel && !panel.querySelector(".editor-btn.primary:disabled")) closePanel();
  });

  window.DSEditor = { decorate, draftFor, editSection, editSettings, newPage, splitPage, joinPage, toBlocks, toMarkdown };
})();
