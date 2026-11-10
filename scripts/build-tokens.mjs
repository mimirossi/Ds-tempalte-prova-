// Turns the token files in /tokens into CSS variables.
// Runs automatically on every push (see .github/workflows/deploy.yml).
//
//   tokens/tokens.css           :root { --color-text-primary: #17171a; … }
//   tokens/tokens.index.json   list of every token, for the "tokens used" tables
//   tokens/tokens.tailwind.css  Tailwind theme, so bg-text-primary etc. work in previews
//
// Rules:
// - a file whose name contains "dark" is written under :root[data-theme="dark"]
// - example.tokens.json is ignored as soon as another token file exists
// - when two files define the same token, the file that comes last alphabetically wins
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const dir = join(root, "tokens")
const config = JSON.parse(readFileSync(join(root, "site.config.json"), "utf8"))
const prefix = config.tokens?.cssPrefix ?? ""

// Same naming as the token tables on the site.
const cssName = (name) => "--" + prefix + name.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase()

function flatten(node, path, type, out) {
  if (!node || typeof node !== "object") return
  if ("$value" in node) {
    out.push({ name: path.join("/"), type: node.$type || type || "", value: node.$value, ext: node.$extensions || {}, description: node.$description || "" })
    return
  }
  for (const key of Object.keys(node)) {
    // "$root" is the token that shares its name with a group (button/inset + button/inset/compact).
    if (key === "$root") flatten(node[key], path, node.$type || type, out)
    else if (!key.startsWith("$")) flatten(node[key], [...path, key], node.$type || type, out)
  }
}

// The name Figma shows in Dev Mode ("code syntax") wins, so copied code matches.
function varName(token) {
  const m = /^var\((--[\w-]+)\)$/.exec(token.ext["com.figma.codeSyntax"]?.WEB ?? "")
  return m ? m[1] : cssName(token.name)
}

const UNITLESS = /weight|opacity|z-?index|column|count|ratio|scale|order/i

function cssValue(token) {
  const { value, type, ext } = token
  const scopes = ext["com.figma.scopes"] || []
  if (type === "color") {
    if (typeof value === "string") return value
    if (value?.hex && (value.alpha == null || value.alpha === 1)) return value.hex.toLowerCase()
    if (Array.isArray(value?.components)) {
      const [r, g, b] = value.components.map((n) => Math.round(n * 255))
      return `rgba(${r}, ${g}, ${b}, ${+(value.alpha ?? 1).toFixed(3)})`
    }
    return null
  }
  if (typeof value === "number") {
    const unitless = scopes.includes("FONT_WEIGHT") || scopes.includes("OPACITY") || UNITLESS.test(token.name)
    return unitless || value === 0 ? String(+value.toFixed(4)) : `${+value.toFixed(4)}px`
  }
  if (typeof value === "string") {
    if (scopes.includes("FONT_FAMILY") || type === "fontFamily") return JSON.stringify(value)
    return /[;{}]/.test(value) ? null : value
  }
  if (value && typeof value === "object" && "value" in value && "unit" in value) return `${value.value}${value.unit}`
  return null
}

let files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort()
if (files.length > 1) files = files.filter((f) => f !== "example.tokens.json")

const sets = files.map((file) => {
  const tokens = []
  try {
    flatten(JSON.parse(readFileSync(join(dir, file), "utf8")), [], "", tokens)
  } catch (error) {
    console.warn(`Skipped ${file}: ${error.message}`)
  }
  return { file, dark: /dark/i.test(file), tokens }
})

const names = new Map(sets.flatMap((s) => s.tokens.map((t) => [t.name, varName(t)]))) // token path -> CSS variable

function declarations(set) {
  const lines = []
  for (const token of set.tokens) {
    const figmaAlias = token.ext["com.figma.aliasData"]?.targetVariableName
    const dtcgAlias = typeof token.value === "string" && /^\{.+\}$/.test(token.value) ? token.value.slice(1, -1) : ""
    const alias = figmaAlias || dtcgAlias
    const target = alias && (names.get(alias) ?? names.get(alias.replace(/\./g, "/")))
    const value = target && target !== varName(token) ? `var(${target})` : dtcgAlias ? null : cssValue(token)
    if (value != null) lines.push(`  ${varName(token)}: ${value};`)
  }
  return lines
}

let css = "/* Generated from the files in /tokens by scripts/build-tokens.mjs. Do not edit by hand. */\n"
let count = 0
const light = {} // name -> value, used to resolve aliases
// Dark files go last so they override the light values.
for (const set of [...sets.filter((s) => !s.dark), ...sets.filter((s) => s.dark)]) {
  const lines = declarations(set)
  if (!lines.length) continue
  count += lines.length
  if (!set.dark) for (const line of lines) light[line.slice(2, line.indexOf(":"))] = line.slice(line.indexOf(":") + 2, -1)
  css += `\n/* ${set.file} */\n${set.dark ? ':root[data-theme="dark"]' : ":root"} {\n${lines.join("\n")}\n}\n`
}
const resolve = (name, depth = 0) => {
  const m = /^var\((--[\w-]+)\)$/.exec(light[name] ?? "")
  return m && depth < 10 ? resolve(m[1], depth + 1) : light[name]
}
writeFileSync(join(dir, "tokens.css"), css)

// Index for the "tokens used by this component" tables on the site.
const index = new Map()
for (const set of sets.filter((s) => !s.dark)) {
  for (const token of set.tokens) {
    const name = varName(token)
    if (!(name in light)) continue
    index.set(name, { name: token.name, var: name, type: token.type, value: light[name], resolved: resolve(name), description: token.description })
  }
}
writeFileSync(join(dir, "tokens.index.json"), JSON.stringify([...index.values()]) + "\n")

// Tailwind: expose every colour token as a colour utility (bg-…, text-…, border-…).
const colors = [...new Set(sets.flatMap((s) => s.tokens.filter((t) => t.type === "color").map(varName)))]
const theme =
  "/* Generated by scripts/build-tokens.mjs. Do not edit by hand. */\n@theme inline {\n" +
  colors
    .map((name) => {
      const utility = "--color-" + name.slice(2).replace(/^colou?rs?-/, "")
      // A token already named --color-… cannot point at itself: use its value.
      return `  ${utility}: ${utility === name ? resolve(name) : `var(${name})`};`
    })
    .join("\n") +
  "\n}\n"
writeFileSync(join(dir, "tokens.tailwind.css"), theme)

console.log(`tokens.css: ${count} variables from ${sets.length} file(s): ${files.join(", ") || "none"}`)
