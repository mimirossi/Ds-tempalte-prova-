/*
 * Design system documentation site.
 * No build step: pages are Markdown files in /content, rendered in the browser.
 * See README.md for how to add pages, images, code and Figma content.
 */
(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const el = (tag, attrs, html) => {
    const node = document.createElement(tag);
    for (const k in attrs || {}) {
      if (k === "class") node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    }
    if (html != null) node.innerHTML = html;
    return node;
  };
  const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const slugify = (s) => norm(s).replace(/ /g, "-");

  const ICON = {
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    image: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    figma: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6a3 3 0 0 1 0 6H9a3 3 0 0 1 0-6Zm0 6h3v6H9a3 3 0 0 1 0-6Zm0 6h3v3a3 3 0 1 1-3-3Zm6-6a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM12 3v6"/></svg>',
  };

  let config = {};
  let manifest = { pages: [] };
  const templates = {};
  const tokenCache = {};

  /* ---------- Helpers ---------- */

  function parseFrontmatter(src) {
    const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src);
    const data = {};
    if (!m) return { data, body: src };
    m[1].split(/\r?\n/).forEach((line) => {
      const i = line.indexOf(":");
      if (i < 1 || /^\s*#/.test(line)) return;
      data[line.slice(0, i).trim()] = line
        .slice(i + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
    });
    return { data, body: src.slice(m[0].length) };
  }

  /** On GitHub Pages the repository is read from the address, so a copy of this template needs no setup. */
  function detectRepo() {
    const host = /^([\w-]+)\.github\.io$/i.exec(location.hostname);
    const name = location.pathname.split("/").filter(Boolean)[0];
    return host && name && !/\.html?$/i.test(name) ? { owner: host[1], name } : null;
  }

  function repoUrl() {
    const r = detectRepo() || config.repo || {};
    return r.owner && r.name ? "https://github.com/" + r.owner + "/" + r.name : "";
  }
  const branch = () => (config.repo && config.repo.branch) || "main";
  const editUrl = (slug) => repoUrl() + "/edit/" + branch() + "/content/" + slug + ".md";
  const imageDir = (slug) => "assets/images/" + (slug === "index" ? "overview" : slug.split("/").pop());
  const uploadUrl = (dir) => repoUrl() + "/upload/" + branch() + "/" + dir;

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1600);
  }

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = el("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    toast((label || "Code") + " copied");
  }

  async function fetchText(path) {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status + " " + path);
    return res.text();
  }

  /* ---------- Markdown ---------- */

  const LANG_ALIAS = { html: "xml", vue: "xml", svg: "xml", jsx: "javascript", tsx: "typescript", sh: "bash", shell: "bash" };

  const FLAGS = ["preview", "component"];

  /** Reads the opening line of a code block: language, flags and labels. */
  function parseInfo(info) {
    info = info || "";
    const attrs = {};
    const rest = info.replace(/(\w+)="([^"]*)"/g, (m, k, v) => ((attrs[k] = v), ""));
    const words = rest.split(/\s+/).filter(Boolean);
    // Code pasted right after the backticks is not a language name: keep it as code.
    const pasted = words.length > 0 && (!/^[\w+#.-]+$/.test(words[0]) || words.slice(1).some((w) => !FLAGS.includes(w)));
    if (pasted) return { pasted: true, lang: "", preview: false, component: false, tab: "", title: "" };
    return { lang: (words[0] || "").toLowerCase(), preview: words.includes("preview"), component: words.includes("component"), tab: attrs.tab || "", title: attrs.title || "" };
  }

  /** Guesses what pasted code is, so it can be highlighted and shown without any flags. */
  function detectCode(code) {
    const text = code.trim();
    if (/^<svg[\s>]/i.test(text)) return { lang: "svg", preview: true };
    const jsx = /<[A-Z][\w.]*[\s/>]|className=|<\/[a-z]+>\s*\)?;?\s*\}?\s*$/.test(text);
    const script = /^\s*(import|export|const|let|function|type|interface|class)\b/m.test(text);
    if (script && jsx) return { lang: "tsx", preview: true, component: /(function|const|class)\s+[A-Z]\w*/.test(text) };
    if (/^<[a-z!]/i.test(text)) return { lang: jsx && /<[A-Z]/.test(text) ? "tsx" : "html", preview: true };
    if (script) return { lang: "typescript" };
    if (/^[.#:@\w-][^{}]*\{[^}]*:[^}]*\}/m.test(text)) return { lang: "css" };
    return { lang: "" };
  }

  marked.use({
    gfm: true,
    renderer: {
      code(token) {
        let info = parseInfo(token.lang);
        if (info.pasted) token = { text: token.lang + "\n" + token.text };
        if (info.pasted || !info.lang) info = Object.assign(info, detectCode(token.text));
        if (info.lang === "tokens") return '<div class="tokens-src">' + esc(token.text) + "</div>";
        return (
          '<div class="code-src" data-lang="' + esc(info.lang) + '" data-tab="' + esc(info.tab) +
          '" data-title="' + esc(info.title) + '"' + (info.preview ? " data-preview" : "") + (info.component ? " data-component" : "") + ">" + esc(token.text) + "</div>"
        );
      },
    },
  });

  function highlight(code, lang) {
    const name = LANG_ALIAS[lang] || lang;
    if (name && window.hljs && hljs.getLanguage(name)) {
      try {
        return hljs.highlight(code, { language: name }).value;
      } catch (e) {}
    }
    return esc(code);
  }

  function codePanel(code, lang) {
    const panel = el("div", { class: "code" });
    panel.appendChild(el("pre", {}, "<code>" + highlight(code, lang) + "</code>"));
    const btn = el("button", { class: "copy-btn", type: "button", "aria-label": "Copy code" }, ICON.copy + "<span>Copy</span>");
    btn.addEventListener("click", () => copy(code));
    panel.appendChild(btn);
    return panel;
  }

  /* ---------- Live previews ---------- */

  const frames = {};
  let frameSeq = 0;
  let tailwindTheme = "";
  window.addEventListener("message", (e) => {
    const d = e.data;
    if (d && d.dsPreview && frames[d.dsPreview]) frames[d.dsPreview].style.height = Math.max(96, Math.ceil(d.height)) + "px";
  });

  const scripts = {};
  function loadScript(src) {
    return (scripts[src] = scripts[src] || new Promise((resolve, reject) => {
      const tag = el("script", { src });
      tag.onload = resolve;
      tag.onerror = () => reject(new Error("Could not load " + src));
      document.head.appendChild(tag);
    }));
  }

  /** Makes module code runnable as a plain script: drops imports and export keywords. */
  function stripModule(code) {
    return code
      .replace(/^[ \t]*import\s*["'][^"']+["'];?[ \t]*$/gm, "")
      .replace(/^[ \t]*import\s[\s\S]*?from\s*["'][^"']+["'];?[ \t]*$/gm, "")
      .replace(/^([ \t]*)export\s+default\s+(?=(async\s+)?function|class)/gm, "$1")
      .replace(/^[ \t]*export\s+default\s+[\w.]+;?[ \t]*$/gm, "")
      .replace(/^[ \t]*export\s*\{[^}]*\};?[ \t]*$/gm, "")
      .replace(/^([ \t]*)export\s+(?=const|let|var|function|async|class|type|interface|enum)/gm, "$1");
  }

  function componentName(code) {
    const m = /export\s+default\s+(?:async\s+)?(?:function|class)\s+(\w+)/.exec(code) || /export\s+default\s+(\w+)\s*;?\s*$/m.exec(code);
    if (m) return m[1];
    const all = Array.from(code.matchAll(/(?:function|const|class)\s+([A-Z]\w*)/g));
    return all.length ? all[all.length - 1][1] : "";
  }

  /** Compiles a JSX/TSX snippet, with the page's component blocks in scope, to plain JS. */
  async function compileReact(snippet, components) {
    await loadScript("app/vendor/babel.min.js");
    let src = components.filter((c) => c !== snippet).map(stripModule).join("\n");
    if (/^\s*</.test(snippet)) {
      src += "\nconst __Preview = () => (<>" + snippet + "</>);";
    } else {
      const name = componentName(snippet);
      if (!name) throw new Error("Nothing to render. Start the block with JSX, or define a component in it.");
      src += "\n" + stripModule(snippet) + "\nconst __Preview = " + name + ";";
    }
    return Babel.transform(src, { filename: "preview.tsx", presets: ["typescript", ["react", { runtime: "classic" }]] }).code;
  }

  const FIGMA_STYLES = ["Thin", "ExtraLight", "Light", "Regular", "Medium", "SemiBold", "Bold", "ExtraBold", "Black"];

  /**
   * Fonts for previews, from "preview.fonts" in site.config.json. Each family is also
   * registered under the names Figma writes in exported code ("Family:Medium"), so
   * pasted code finds its font. The first family is the default text font.
   */
  // Font files are inlined: a sandboxed preview cannot fetch fonts from the site.
  const fontData = {};
  async function loadFonts() {
    await Promise.all(
      ((config.preview && config.preview.fonts) || []).map(async (f) => {
        try {
          const res = await fetch(f.src);
          if (!res.ok) return;
          const bytes = new Uint8Array(await res.arrayBuffer());
          let bin = "";
          for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
          fontData[f.src] = "data:font/" + (f.src.split(".").pop() || "woff2").toLowerCase() + ";base64," + btoa(bin);
        } catch (e) {}
      })
    );
  }

  function fontCss() {
    const fonts = (config.preview && config.preview.fonts) || [];
    let css = "";
    fonts.forEach((f) => {
      if (!f.family || !f.src) return;
      const format = /\.woff2$/i.test(f.src) ? "woff2" : /\.woff$/i.test(f.src) ? "woff" : /\.otf$/i.test(f.src) ? "opentype" : "truetype";
      const face = (name, weight) =>
        '@font-face{font-family:"' + name + '";src:url("' + (fontData[f.src] || f.src) + '") format("' + format + '");font-weight:' + weight + ";font-style:" + (f.style || "normal") + ";font-display:swap}";
      css += face(f.family, f.weight || "400");
      // A variable font answers to every Figma style name; a static file only to its own.
      if (/\s/.test(String(f.weight || ""))) FIGMA_STYLES.forEach((style) => (css += face(f.family + ":" + style, f.weight)));
      else if (f.figmaStyle) css += face(f.family + ":" + f.figmaStyle, f.weight || "400");
    });
    if (fonts[0] && fonts[0].family) css += 'body.ds-preview{font-family:"' + fonts[0].family + '",system-ui,sans-serif}';
    return css.replace(/<\//g, "");
  }

  function frameDoc(id, body, script, react) {
    const pv = config.preview || {};
    const tag = (src) => '<script src="' + esc(src) + '"></' + "script>";
    const safe = (code) => code.replace(/<\/(script|style)/gi, "<\\/$1");
    return (
      '<!doctype html><html data-theme="' + (document.documentElement.dataset.theme || "light") + '"><head><meta charset="utf-8"><base href="' +
      esc(document.baseURI.split("#")[0]) + '">' +
      "<style>" + fontCss() + "</style>" +
      "<style>.ds-preview-error{margin:0;padding:12px;color:#c62828;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;text-align:left}</style>" +
      (pv.stylesheets || []).map((href) => '<link rel="stylesheet" href="' + esc(href) + '">').join("") +
      (pv.tailwind ? (tailwindTheme ? '<style type="text/tailwindcss">' + safe(tailwindTheme) + "</style>" : "") + tag("app/vendor/tailwind-browser.js") : "") +
      (react ? tag("app/vendor/react.min.js") + tag("app/vendor/react-dom.min.js") : "") +
      '</head><body class="ds-preview">' + body +
      "<script>(function(){var post=function(){parent.postMessage({dsPreview:" + id + ",height:document.body.scrollHeight},'*')};" +
      "var fail=function(m){document.body.innerHTML='<pre class=\"ds-preview-error\"></pre>';document.body.firstChild.textContent='Preview error: '+m;post()};" +
      "window.onerror=function(m){fail(String(m))};new ResizeObserver(post).observe(document.body);addEventListener('load',post);" +
      "try{" + (script ? safe(script) : "") + "}catch(e){fail(e.message)}})();</" + "script></body></html>"
    );
  }

  const REACT_LANGS = ["jsx", "tsx", "react"];

  function previewPanel(code, lang, components) {
    const panel = el("div", { class: "preview" });
    const id = ++frameSeq;
    const frame = el("iframe", { sandbox: "allow-scripts", title: "Preview" });
    frames[id] = frame;
    panel.appendChild(frame);
    if (REACT_LANGS.includes(lang)) {
      compileReact(code, components)
        .then((js) => {
          const run =
            "Object.assign(window,React);if(!window.cn)window.cn=function(){return Array.prototype.slice.call(arguments).flat(9).filter(Boolean).join(' ')};\n" +
            js + "\nReactDOM.createRoot(document.getElementById('root')).render(React.createElement(__Preview));";
          frame.srcdoc = frameDoc(id, '<div id="root" style="display:contents"></div>', run, true);
        })
        .catch((e) => {
          frame.srcdoc = frameDoc(id, '<pre class="ds-preview-error">' + esc("Preview error: " + e.message) + "</pre>", "", false);
        });
    } else {
      frame.srcdoc = frameDoc(id, code, "", false);
    }
    return panel;
  }

  /** Turns runs of fenced code blocks into copyable blocks, tab groups and live previews. */
  function enhanceCode(root) {
    const done = new Set();
    // Blocks flagged `component` are in scope for every React preview on the page.
    const components = $$(".code-src[data-component]", root).map((n) => n.textContent);
    $$(".code-src", root).forEach((first) => {
      if (done.has(first)) return;
      const group = [first];
      if (first.dataset.tab) {
        let next = first.nextElementSibling;
        while (next && next.classList.contains("code-src") && next.dataset.tab) {
          group.push(next);
          next = next.nextElementSibling;
        }
      }
      group.forEach((g) => done.add(g));

      const panels = [];
      const previewSrc = group.find((g) => g.hasAttribute("data-preview"));
      if (previewSrc) panels.push({ label: "Preview", node: previewPanel(previewSrc.textContent, previewSrc.dataset.lang, components) });
      group.forEach((g) =>
        panels.push({ label: g.dataset.tab || (previewSrc ? "Code" : ""), node: codePanel(g.textContent, g.dataset.lang) })
      );

      const block = el("div", { class: "block" });
      if (panels.length > 1) {
        const tabs = el("div", { class: "tabs", role: "tablist" });
        panels.forEach((p, i) => {
          const tab = el("button", { class: "tab", type: "button", role: "tab", "aria-selected": i === 0 ? "true" : "false" }, esc(p.label));
          tab.addEventListener("click", () => {
            $$(".tab", tabs).forEach((t, j) => t.setAttribute("aria-selected", j === i ? "true" : "false"));
            panels.forEach((q, j) => (q.node.hidden = j !== i));
          });
          tabs.appendChild(tab);
          p.node.hidden = i !== 0;
        });
        block.appendChild(tabs);
      } else if (first.dataset.title) {
        block.appendChild(el("div", { class: "tabs" }, '<span class="file">' + esc(first.dataset.title) + "</span>"));
      }
      panels.forEach((p) => block.appendChild(p.node));
      first.replaceWith(block);
      group.slice(1).forEach((g) => g.remove());
    });
  }

  const CALLOUTS = { NOTE: "Note", WARNING: "Warning", DO: "Do", DONT: "Don't" };

  /** `> [!TODO]`, `> [!DO]`, `> [!DONT]`, `> [!NOTE]`, `> [!WARNING]` blockquotes. */
  function enhanceCallouts(root, slug) {
    $$("blockquote", root).forEach((bq) => {
      const p = bq.firstElementChild;
      if (!p || p.tagName !== "P") return;
      const m = /^\s*\[!(\w+)\]\s*/.exec(p.innerHTML);
      if (!m) return;
      const type = m[1].toUpperCase();
      p.innerHTML = p.innerHTML.slice(m[0].length);
      if (!p.innerHTML.trim()) p.remove();

      if (type === "TODO") {
        const box = el("div", { class: "todo" });
        box.appendChild(
          el("div", { class: "todo-head" },
            "<span>To add</span>" + (repoUrl() ? '<a class="edit-only" href="' + editUrl(slug) + '" target="_blank" rel="noopener">Add content →</a>' : ""))
        );
        const body = el("div", { class: "todo-body" });
        while (bq.firstChild) body.appendChild(bq.firstChild);
        box.appendChild(body);
        bq.replaceWith(box);
      } else if (CALLOUTS[type]) {
        const box = el("div", { class: "callout " + type.toLowerCase() });
        box.appendChild(el("span", { class: "callout-label" }, CALLOUTS[type]));
        while (bq.firstChild) box.appendChild(bq.firstChild);
        bq.replaceWith(box);
      }
    });
    // Adjacent Do / Don't callouts sit side by side.
    $$(".callout.do, .callout.dont", root).forEach((c) => {
      if (c.parentElement.classList.contains("do-dont")) return;
      const wrap = el("div", { class: "do-dont" });
      c.before(wrap);
      let node = c;
      while (node && node.classList && (node.classList.contains("do") || node.classList.contains("dont")) && node.classList.contains("callout")) {
        const next = node.nextElementSibling;
        wrap.appendChild(node);
        node = next;
      }
    });
  }

  /** Images become figures; an image that does not exist yet shows an upload placeholder. */
  function enhanceImages(root, onChange) {
    $$("img", root).forEach((img) => {
      const src = img.getAttribute("src") || "";
      const figure = el("figure", { class: "figure" });
      const holder = img.parentElement.tagName === "P" && img.parentElement.childNodes.length === 1 ? img.parentElement : img;
      holder.replaceWith(figure);
      figure.appendChild(img);
      if (img.title) figure.appendChild(el("figcaption", {}, esc(img.title)));

      const missing = () => {
        if (/^https?:/i.test(src)) return;
        const dir = src.split("/").slice(0, -1).join("/");
        const box = el("div", { class: "img-missing" },
          ICON.image + "<strong>" + esc(img.alt || "Image") + "</strong><span>Upload this file to show it here:</span><code>" + esc(src) + "</code>" +
            (repoUrl() ? '<a class="edit-only" href="' + uploadUrl(dir) + '" target="_blank" rel="noopener">Upload image →</a>' : ""));
        figure.replaceWith(box);
        onChange();
      };
      if (img.complete && img.naturalWidth === 0 && src) missing();
      else img.addEventListener("error", missing, { once: true });
    });
  }

  /** A Figma link alone on its own line becomes an embedded frame. */
  function enhanceFigma(root) {
    $$("p", root).forEach((p) => {
      if (p.children.length !== 1 || p.firstElementChild.tagName !== "A") return;
      const a = p.firstElementChild;
      if (p.textContent.trim() !== a.textContent.trim()) return;
      let url;
      try {
        url = new URL(a.href);
      } catch (e) {
        return;
      }
      if (!/(^|\.)figma\.com$/.test(url.hostname) || !/^\/(design|file|proto|board|slides)\//.test(url.pathname)) return;
      const embed = new URL(url.href);
      embed.hostname = "embed.figma.com";
      embed.pathname = embed.pathname.replace(/^\/file\//, "/design/");
      embed.searchParams.set("embed-host", "design-system-docs");
      const box = el("div", { class: "figma" });
      box.appendChild(el("iframe", { src: embed.href, loading: "lazy", allowfullscreen: "", title: "Figma embed" }));
      const label = a.textContent.trim() === a.href ? "Figma" : a.textContent.trim();
      box.appendChild(el("div", { class: "figma-foot" }, "<span>" + esc(label) + '</span><a href="' + esc(a.href) + '" target="_blank" rel="noopener">Open in Figma →</a>'));
      p.replaceWith(box);
    });
  }

  /* ---------- Design tokens (Figma variable exports / DTCG JSON) ---------- */

  function flattenTokens(node, path, type, out) {
    if (!node || typeof node !== "object") return;
    if ("$value" in node) {
      out.push({ name: path.join("/"), type: node.$type || type || "", value: node.$value, description: node.$description || "", ext: node.$extensions || {} });
      return;
    }
    const groupType = node.$type || type;
    Object.keys(node).forEach((k) => {
      if (k === "$root") flattenTokens(node[k], path, groupType, out);
      else if (k[0] !== "$") flattenTokens(node[k], path.concat(k), groupType, out);
    });
  }

  function colorOf(value) {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      if (value.hex && (value.alpha == null || value.alpha === 1)) return value.hex;
      if (Array.isArray(value.components)) {
        const c = value.components.map((n) => Math.round(n * 255));
        return "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", " + (value.alpha == null ? 1 : +value.alpha.toFixed(2)) + ")";
      }
    }
    return "";
  }

  async function renderTokens(box, slug, onChange) {
    const spec = {};
    box.textContent.split(/\r?\n/).forEach((line) => {
      const i = line.indexOf(":");
      if (i > 0) spec[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    });
    const file = spec.file || "";
    let json;
    try {
      json = tokenCache[file] || (tokenCache[file] = JSON.parse(await fetchText(file)));
    } catch (e) {
      const todo = el("div", { class: "todo" },
        '<div class="todo-head"><span>Tokens missing</span>' +
          (repoUrl() ? '<a class="edit-only" href="' + uploadUrl("tokens") + '" target="_blank" rel="noopener">Upload tokens →</a>' : "") +
          '</div><div class="todo-body"><p>Export the variables from Figma and upload the file as <code>' + esc(file || "tokens/….tokens.json") + "</code>. This table fills itself in.</p></div>");
      box.replaceWith(todo);
      onChange();
      return;
    }

    let node = json;
    (spec.path || "").split(/[/.]/).filter(Boolean).forEach((k) => (node = node && node[k]));
    let tokens = [];
    flattenTokens(node, (spec.path || "").split(/[/.]/).filter(Boolean), "", tokens);
    if (spec.type) tokens = tokens.filter((t) => t.type === spec.type);

    const all = [];
    flattenTokens(json, [], "", all);
    const byName = {};
    all.forEach((t) => (byName[t.name] = t));
    const resolve = (t, depth) => {
      const m = typeof t.value === "string" && /^\{(.+)\}$/.exec(t.value);
      const target = m && byName[m[1].replace(/\./g, "/")];
      return target && (depth || 0) < 8 ? resolve(target, (depth || 0) + 1) : t.value;
    };

    const prefix = (config.tokens && config.tokens.cssPrefix) || "";
    const rows = tokens.map((t) => {
      const value = resolve(t);
      const figmaAlias = t.ext["com.figma.aliasData"] && t.ext["com.figma.aliasData"].targetVariableName;
      const alias = figmaAlias || (typeof t.value === "string" && /^\{.+\}$/.test(t.value) ? t.value.slice(1, -1) : "");
      const syntax = /^var\((--[\w-]+)\)$/.exec((t.ext["com.figma.codeSyntax"] || {}).WEB || "");
      const cssVar = syntax ? syntax[1] : "--" + prefix + t.name.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
      let visual = "";
      let shown = typeof value === "object" ? JSON.stringify(value) : String(value);
      if (t.type === "color") {
        shown = colorOf(value);
        visual = '<span class="swatch" style="background:' + esc(shown) + '"></span>';
      } else if (typeof value === "number" || /^-?[\d.]+(px|rem)?$/.test(shown)) {
        const n = parseFloat(shown);
        if (/radius|corner/i.test(t.name)) visual = '<span class="radius-demo" style="border-top-left-radius:' + Math.min(n, 36) + 'px"></span>';
        else if (n >= 0 && n <= 2000) visual = '<span class="bar" style="width:' + Math.min(n, 224) + 'px"></span>';
      }
      return (
        "<tr><td>" + visual + '</td><td><span class="token-name">' + esc(t.name) + "</span>" +
        (alias ? '<span class="token-alias">→ ' + esc(alias) + "</span>" : "") +
        (t.description ? '<span class="token-alias">' + esc(t.description) + "</span>" : "") +
        '</td><td class="token-name">' + esc(shown) + '</td><td><button type="button" class="token-copy" data-copy="var(' + esc(cssVar) + ')">' + esc(cssVar) + "</button></td></tr>"
      );
    });

    const wrap = el("div", { class: "table-wrap" },
      "<table><thead><tr><th></th><th>Token</th><th>Value</th><th>CSS variable</th></tr></thead><tbody>" +
        (rows.join("") || '<tr><td colspan="4" class="muted">No tokens found at this path.</td></tr>') + "</tbody></table>");
    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".token-copy");
      if (btn) copy(btn.dataset.copy, "Variable");
    });
    box.replaceWith(wrap);
  }

  /* ---------- Page rendering ---------- */

  function buildToc(content) {
    const toc = $("#toc");
    const heads = $$("h2, h3", content);
    if (heads.length < 2) return (toc.innerHTML = "");
    toc.innerHTML = "<p>On this page</p>";
    heads.forEach((h, i) => {
      // A section still has placeholders if any appear before the next H2.
      let open = false;
      if (h.tagName === "H2") {
        for (let n = h.nextElementSibling; n && n.tagName !== "H2"; n = n.nextElementSibling) {
          if (n.matches(".todo, .img-missing") || n.querySelector(".todo, .img-missing")) open = true;
        }
      }
      const btn = el("button", { type: "button", class: h.tagName === "H3" ? "nested" : "" },
        (open ? '<span class="dot edit-only" title="Has placeholders"></span>' : "") + "<span>" + esc(h.textContent) + "</span>");
      if (h.classList.contains("section-missing")) btn.classList.add("edit-only");
      btn.addEventListener("click", () => h.scrollIntoView({ behavior: "smooth" }));
      toc.appendChild(btn);
    });
  }

  function pageMeta(slug) {
    return manifest.pages.find((p) => p.slug === slug);
  }

  async function renderPage(slug) {
    const article = $("#article");
    let src;
    try {
      src = await fetchText("content/" + slug + ".md");
    } catch (e) {
      $("#toc").innerHTML = "";
      article.innerHTML =
        '<div class="page-header"><h1>Page not found</h1><p class="lead">There is no page at <code>content/' + esc(slug) + '.md</code>. <a href="#/">Back to the overview</a></p></div>';
      return;
    }
    const { data, body } = parseFrontmatter(src);
    const meta = pageMeta(slug) || {};
    const title = data.title || meta.title || slug;
    document.title = slug === "index" ? config.title || title : title + " · " + (config.title || "Design System");

    article.innerHTML = "";
    const header = el("header", { class: "page-header" });
    const badges = [];
    if (data.group) badges.push('<span class="badge">' + esc(data.group) + "</span>");
    if (data.status) badges.push('<span class="badge">' + esc(data.status) + "</span>");
    badges.push('<span class="badge edit-only" id="progress"></span>');
    header.innerHTML =
      '<div class="page-meta">' + badges.join("") + "</div><h1>" + esc(title) + "</h1>" +
      (data.description ? '<p class="lead">' + esc(data.description) + "</p>" : "");
    const bar = el("div", { class: "edit-bar" });
    if (data.figma) bar.innerHTML += '<a href="' + esc(data.figma) + '" target="_blank" rel="noopener">' + ICON.figma + "Open in Figma</a>";
    if (repoUrl()) {
      bar.innerHTML +=
        '<a class="edit-only" href="' + editUrl(slug) + '" target="_blank" rel="noopener">' + ICON.edit + "Edit this page</a>" +
        '<a class="edit-only" href="' + uploadUrl(imageDir(slug)) + '" target="_blank" rel="noopener">' + ICON.image + "Upload images</a>";
    }
    if (bar.innerHTML) header.appendChild(bar);
    article.appendChild(header);

    const content = el("div", { class: "content" }, marked.parse(body));
    article.appendChild(content);

    // Sections the page template expects but the page does not have yet.
    const tpl = (config.templates || {})[data.type];
    if (tpl) {
      const have = $$("h2", content).map((h) => norm(h.textContent));
      tpl.sections.forEach((s) => {
        if (have.includes(norm(s.title))) return;
        content.appendChild(el("h2", { class: "section-missing" }, esc(s.title)));
        content.appendChild(
          el("div", { class: "todo section-missing" },
            '<div class="todo-head"><span>Section missing</span><a class="edit-only" href="' + editUrl(slug) + '" target="_blank" rel="noopener">Add content →</a></div>' +
              '<div class="todo-body"><p>' + esc(s.hint || "") + " Add a <code>## " + esc(s.title) + "</code> heading to this page.</p></div>"));
      });
    }

    const refresh = () => {
      const left = $$(".todo, .img-missing", article).length;
      const badge = $("#progress");
      if (badge) {
        badge.className = "badge edit-only " + (left ? "is-open" : "is-done");
        badge.textContent = left ? left + (left === 1 ? " placeholder" : " placeholders") + " left" : "Complete";
      }
      const count = $('.nav-link[data-slug="' + slug + '"] .nav-count');
      if (count) {
        count.textContent = left;
        count.hidden = !left;
      }
      buildToc(content);
    };

    enhanceCallouts(content, slug);
    enhanceCode(content);
    enhanceFigma(content);
    enhanceImages(content, refresh);
    $$("table", content).forEach((t) => {
      if (t.parentElement.classList.contains("table-wrap")) return;
      const wrap = el("div", { class: "table-wrap" });
      t.before(wrap);
      wrap.appendChild(t);
    });
    $$("h2, h3", content).forEach((h) => (h.id = slugify(h.textContent)));
    $$('a[href^="http"]', content).forEach((a) => a.setAttribute("target", "_blank"));
    if (slug === "index") content.appendChild(overviewCards());
    refresh();
    await Promise.all($$(".tokens-src", content).map((box) => renderTokens(box, slug, refresh)));
    refresh();
  }

  function grouped(pages) {
    const order = config.groups || [];
    const groups = {};
    pages.forEach((p) => (groups[p.group || "Pages"] = groups[p.group || "Pages"] || []).push(p));
    return Object.keys(groups)
      .sort((a, b) => (order.indexOf(a) < 0 ? 999 : order.indexOf(a)) - (order.indexOf(b) < 0 ? 999 : order.indexOf(b)) || a.localeCompare(b))
      .map((name) => ({ name, pages: groups[name].sort((a, b) => (a.order || 999) - (b.order || 999) || a.title.localeCompare(b.title)) }));
  }

  function overviewCards() {
    const wrap = el("div");
    grouped(manifest.pages.filter((p) => p.slug !== "index")).forEach((g) => {
      const section = el("section", { class: "cards-group" }, "<h2>" + esc(g.name) + '</h2><div class="cards"></div>');
      g.pages.forEach((p) => {
        $(".cards", section).appendChild(
          el("a", { class: "card", href: "#/" + p.slug },
            '<div class="card-top"><span>' + esc(p.title) + "</span>" +
              (p.placeholders ? '<span class="nav-count edit-only" title="Placeholders left">' + p.placeholders + "</span>" : "") +
              "</div><p>" + esc(p.description || "") + "</p>"));
      });
      wrap.appendChild(section);
    });
    return wrap;
  }

  function renderNav() {
    const nav = $("#nav");
    const query = norm($("#search").value);
    const current = currentSlug();
    nav.innerHTML = "";
    const link = (p) => {
      const a = el("a", { class: "nav-link", href: "#/" + (p.slug === "index" ? "" : p.slug), "data-slug": p.slug },
        "<span>" + esc(p.slug === "index" ? "Overview" : p.title) + '</span><span class="nav-count edit-only" title="Placeholders left"' +
          (p.placeholders ? "" : " hidden") + ">" + (p.placeholders || 0) + "</span>");
      if (p.slug === current) a.setAttribute("aria-current", "page");
      return a;
    };
    const pages = manifest.pages.filter((p) => !query || norm(p.title + " " + (p.description || "")).includes(query));
    const home = pages.find((p) => p.slug === "index");
    if (home) nav.appendChild(el("div", { class: "nav-group" })).appendChild(link(home));
    grouped(pages.filter((p) => p.slug !== "index")).forEach((g) => {
      const box = el("div", { class: "nav-group" }, "<h4>" + esc(g.name) + "</h4>");
      g.pages.forEach((p) => box.appendChild(link(p)));
      nav.appendChild(box);
    });
    if (!pages.length) nav.innerHTML = '<p class="muted" style="padding:0 .6rem;font-size:.9rem">No pages found.</p>';
  }

  function renderNewPageLinks() {
    const box = $("#new-page");
    box.innerHTML = "";
    if (!repoUrl()) return;
    (config.newPage || []).forEach((item) => {
      let href = repoUrl() + "/new/" + branch() + "/" + item.folder + "?filename=" + encodeURIComponent(item.filename);
      const tpl = templates[item.template];
      if (tpl && encodeURIComponent(tpl).length < 6000) href += "&value=" + encodeURIComponent(tpl);
      box.appendChild(el("a", { href, target: "_blank", rel: "noopener" }, ICON.plus + esc(item.label)));
    });
  }

  /* ---------- Routing and chrome ---------- */

  function currentSlug() {
    const hash = decodeURIComponent(location.hash.replace(/^#\/?/, "")).replace(/\/+$/, "");
    return hash && /^[\w\-/]+$/.test(hash) ? hash : "index";
  }

  async function route() {
    document.body.classList.remove("menu-open");
    $("#menu-btn").setAttribute("aria-expanded", "false");
    renderNav();
    await renderPage(currentSlug());
    window.scrollTo(0, 0);
  }

  function setEditMode(on) {
    document.body.classList.toggle("no-edit", !on);
    $("#edit-toggle").setAttribute("aria-pressed", on ? "true" : "false");
  }

  async function init() {
    try {
      config = JSON.parse(await fetchText("site.config.json"));
    } catch (e) {
      config = {};
    }
    try {
      manifest = JSON.parse(await fetchText("content/manifest.json"));
    } catch (e) {
      manifest = { pages: [{ slug: "index", title: "Overview" }] };
    }
    await Promise.all(
      (config.newPage || []).map(async (item) => {
        try {
          templates[item.template] = await fetchText(item.template);
        } catch (e) {}
      })
    );

    if (config.preview && config.preview.tailwind) {
      // Colour utilities generated from /tokens, then the hand-written theme on top.
      for (const file of ["tokens/tokens.tailwind.css", config.preview.tailwindTheme]) {
        if (!file) continue;
        try {
          tailwindTheme += (await fetchText(file)) + "\n";
        } catch (e) {}
      }
    }

    await loadFonts();

    $("#brand-title").textContent = config.title || "Design System";
    $("#brand-badge").textContent = config.badge || "DS";

    let edit = config.editMode !== false;
    try {
      const saved = localStorage.getItem("ds-edit");
      if (saved) edit = saved === "on";
    } catch (e) {}
    setEditMode(edit);
    $("#edit-toggle").addEventListener("click", () => {
      const on = document.body.classList.contains("no-edit");
      setEditMode(on);
      try {
        localStorage.setItem("ds-edit", on ? "on" : "off");
      } catch (e) {}
    });
    $("#theme-toggle").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("ds-theme", next);
      } catch (e) {}
      if ($(".preview")) renderPage(currentSlug()); // previews follow the theme
    });
    $("#menu-btn").addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      $("#menu-btn").setAttribute("aria-expanded", open ? "true" : "false");
    });
    $("#search").addEventListener("input", renderNav);

    renderNewPageLinks();
    window.addEventListener("hashchange", route);
    route();
  }

  init();
})();
