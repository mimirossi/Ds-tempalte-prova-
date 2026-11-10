// Lists the font files in /preview/fonts so previews can load them.
// Runs automatically on every push (see .github/workflows/deploy.yml).
// Family, weight and style are read from each font file: uploading the file is enough.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { brotliDecompressSync, inflateSync } from "node:zlib"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const dir = join(root, "preview", "fonts")

const WOFF2_TAGS = ("cmap head hhea hmtx maxp name OS/2 post cvt_ fpgm glyf loca prep CFF_ VORG EBDT EBLC gasp hdmx kern LTSH PCLT VDMX vhea vmtx BASE GDEF GPOS GSUB EBSC JSTF MATH CBDT CBLC COLR CPAL SVG_ sbix acnt avar bdat bloc bsln cvar fdsc feat fmtx fvar gvar hsty just lcar mort morx opbd prop trak Zapf Silf Glat Gloc Feat Sill")
  .split(" ")
  .map((t) => t.replace("_", " "))

/** Returns the raw bytes of the tables we need, whatever the container format. */
function readTables(buf, wanted) {
  const tables = {}
  const signature = buf.toString("latin1", 0, 4)
  if (signature === "wOF2") {
    const numTables = buf.readUInt16BE(12)
    let pos = 48
    const base128 = () => {
      let value = 0
      for (let i = 0; i < 5; i++) {
        const byte = buf[pos++]
        value = value * 128 + (byte & 0x7f)
        if (!(byte & 0x80)) break
      }
      return value
    }
    const entries = []
    for (let i = 0; i < numTables; i++) {
      const flags = buf[pos++]
      let tag = WOFF2_TAGS[flags & 0x3f]
      if ((flags & 0x3f) === 0x3f) {
        tag = buf.toString("latin1", pos, pos + 4)
        pos += 4
      }
      const version = flags >> 6
      const origLength = base128()
      const transformed = tag === "glyf" || tag === "loca" ? version === 0 : version !== 0
      entries.push({ tag, length: transformed ? base128() : origLength })
    }
    const data = brotliDecompressSync(buf.subarray(pos, pos + buf.readUInt32BE(20)))
    let offset = 0
    for (const entry of entries) {
      if (wanted.includes(entry.tag)) tables[entry.tag] = data.subarray(offset, offset + entry.length)
      offset += entry.length
    }
  } else if (signature === "wOFF") {
    const numTables = buf.readUInt16BE(12)
    for (let i = 0; i < numTables; i++) {
      const p = 44 + i * 20
      const tag = buf.toString("latin1", p, p + 4)
      if (!wanted.includes(tag)) continue
      const offset = buf.readUInt32BE(p + 4), compLength = buf.readUInt32BE(p + 8), origLength = buf.readUInt32BE(p + 12)
      const raw = buf.subarray(offset, offset + compLength)
      tables[tag] = compLength < origLength ? inflateSync(raw) : raw
    }
  } else {
    const numTables = buf.readUInt16BE(4)
    for (let i = 0; i < numTables; i++) {
      const p = 12 + i * 16
      const tag = buf.toString("latin1", p, p + 4)
      if (wanted.includes(tag)) tables[tag] = buf.subarray(buf.readUInt32BE(p + 8), buf.readUInt32BE(p + 8) + buf.readUInt32BE(p + 12))
    }
  }
  return tables
}

function readNames(table) {
  const names = {}
  const count = table.readUInt16BE(2), storage = table.readUInt16BE(4)
  for (let i = 0; i < count; i++) {
    const p = 6 + i * 12
    const platform = table.readUInt16BE(p), nameId = table.readUInt16BE(p + 6)
    const bytes = table.subarray(storage + table.readUInt16BE(p + 10), storage + table.readUInt16BE(p + 10) + table.readUInt16BE(p + 8))
    if (![1, 2, 16, 17].includes(nameId)) continue
    // Windows / Unicode names are UTF-16BE and win over Mac ones.
    if (platform === 3 || platform === 0) names[nameId] = Buffer.from(bytes).swap16().toString("utf16le")
    else if (!(nameId in names)) names[nameId] = bytes.toString("latin1")
  }
  return names
}

function describe(file) {
  const tables = readTables(readFileSync(join(dir, file)), ["name", "OS/2", "fvar"])
  const names = readNames(tables.name)
  // Without a typographic family name, drop the style words some fonts append ("Inter SemiBold", "… 96pt ExtraBold").
  const STYLE_WORD = /\s+(\d+pt|thin|hairline|extra\s?light|ultra\s?light|light|regular|book|medium|semi\s?bold|demi\s?bold|bold|extra\s?bold|ultra\s?bold|black|heavy|italic|oblique|condensed|expanded|variable)$/i
  let family = names[16] || names[1]
  if (family && !names[16]) while (STYLE_WORD.test(family)) family = family.replace(STYLE_WORD, "")
  const style = names[17] || names[2] || "Regular"
  if (!family) throw new Error("no family name")
  const font = { family, src: "preview/fonts/" + file, weight: String(tables["OS/2"] ? tables["OS/2"].readUInt16BE(4) : 400), figmaStyle: style }
  if (/italic|oblique/i.test(style) || (tables["OS/2"] && tables["OS/2"].readUInt16BE(62) & 1)) font.style = "italic"
  if (tables.fvar) {
    const fvar = tables.fvar
    const axes = fvar.readUInt16BE(4), axisCount = fvar.readUInt16BE(8), axisSize = fvar.readUInt16BE(10)
    for (let i = 0; i < axisCount; i++) {
      const p = axes + i * axisSize
      if (fvar.toString("latin1", p, p + 4) !== "wght") continue
      font.weight = `${Math.round(fvar.readInt32BE(p + 4) / 65536)} ${Math.round(fvar.readInt32BE(p + 12) / 65536)}`
      delete font.figmaStyle // a variable font answers to every style name
    }
  }
  return font
}

/** Fallback when a file cannot be read: "Family Name-Bold.woff2". */
function fromFileName(file) {
  const [name, style = "Regular"] = file.replace(/\.\w+$/, "").split(/-(?=[^-]*$)/)
  const weights = { thin: 100, extralight: 200, light: 300, regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 }
  const key = style.replace(/italic/i, "").toLowerCase() || "regular"
  return {
    family: name.replace(/[_]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim(),
    src: "preview/fonts/" + file,
    weight: String(weights[key] || 400),
    figmaStyle: style,
    ...(/italic/i.test(style) ? { style: "italic" } : {}),
  }
}

const fonts = []
for (const file of existsSync(dir) ? readdirSync(dir).sort() : []) {
  if (!/\.(woff2?|ttf|otf)$/i.test(file)) continue
  try {
    fonts.push(describe(file))
  } catch (error) {
    console.warn(`${file}: read from the file name (${error.message})`)
    fonts.push(fromFileName(file))
  }
}
writeFileSync(join(root, "preview", "fonts.json"), JSON.stringify(fonts, null, 2) + "\n")
console.log(`fonts.json: ${fonts.length} font file(s)` + fonts.map((f) => `\n  ${f.family} · ${f.weight}${f.style ? " italic" : ""} · ${f.src}`).join(""))
