// Builds content/manifest.json: the list of pages the sidebar shows.
// Runs automatically on every push (see .github/workflows/deploy.yml).
// To run it by hand: node scripts/build-manifest.mjs
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const contentDir = join(root, "content")
const config = JSON.parse(readFileSync(join(root, "site.config.json"), "utf8"))

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    if (name.startsWith("_") || name.startsWith(".")) return []
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return walk(path)
    return name.endsWith(".md") ? [path] : []
  })
}

function parseFrontmatter(src) {
  const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src)
  const data = {}
  if (!m) return { data, body: src }
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":")
    if (i < 1 || /^\s*#/.test(line)) continue
    data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "")
  }
  return { data, body: src.slice(m[0].length) }
}

const pages = walk(contentDir).map((file) => {
  const slug = relative(contentDir, file).replace(/\\/g, "/").replace(/\.md$/, "")
  const { data, body } = parseFrontmatter(readFileSync(file, "utf8"))
  const prose = body.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[`~]*[ \t]*$/gm, "") // ignore fenced code

  // Placeholders left on the page: TODO boxes, images not uploaded yet,
  // token files not uploaded yet, and template sections not written yet.
  let placeholders = (prose.match(/^>\s*\[!TODO\]/gim) || []).length
  for (const m of prose.matchAll(/!\[[^\]]*\]\(\s*([^)\s]+)/g)) {
    if (!/^https?:/i.test(m[1]) && !existsSync(join(root, m[1]))) placeholders++
  }
  for (const m of body.matchAll(/^```tokens\s*\n([\s\S]*?)^```/gm)) {
    const file = /^file:\s*(.+)$/m.exec(m[1])
    if (!file && /^(used|match):/m.test(m[1])) {
      if (!/var\(\s*--/.test(body)) placeholders++ // "tokens used" table with nothing to show yet
    } else if (!file || !existsSync(join(root, file[1].trim()))) placeholders++
  }
  const sections = config.templates?.[data.type]?.sections ?? []
  const have = [...prose.matchAll(/^##\s+(.+)$/gm)].map((m) => norm(m[1]))
  placeholders += sections.filter((s) => !have.includes(norm(s.title))).length

  return {
    slug,
    title: data.title || slug,
    group: slug === "index" ? "" : data.group || "Pages",
    order: Number(data.order) || 999,
    type: data.type || "",
    description: data.description || "",
    status: data.status || "",
    placeholders,
  }
})

pages.sort((a, b) => a.slug.localeCompare(b.slug))
writeFileSync(join(contentDir, "manifest.json"), JSON.stringify({ pages }, null, 2) + "\n")
console.log(`manifest.json: ${pages.length} pages, ${pages.reduce((n, p) => n + p.placeholders, 0)} placeholders left`)
