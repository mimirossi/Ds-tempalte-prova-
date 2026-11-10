# Tokens

Design token files exported from Figma go here.

1. In Figma, open the Variables panel and export the collection as JSON (one file per collection or mode).
2. Upload the file to this folder. Keep the same file name on later exports so pages update on their own.
3. Reference it from a page:

````markdown
```tokens
file: tokens/light.tokens.json
path: color
```
````

Both Figma's native variable export and the W3C design tokens format (`$type` / `$value`) are read. `example.tokens.json` is sample data: delete it once real exports are in place.

## CSS variables

On every publish the files in this folder are turned into CSS variables, one per token:

| Token | CSS variable | Tailwind class (colours) |
| --- | --- | --- |
| `background/default` | `var(--background-default)` | `bg-background-default` |
| `radius/md` | `var(--radius-md)` | |

- The result is published at `tokens/tokens.css` on the site. Developers can link or copy that file.
- Every live preview loads it, so component code can use the variables and stays in sync with Figma.
- A file with `dark` in its name (for example `dark.tokens.json`) applies when the dark theme is on.
- Numbers become `px`, except weights and opacities. Aliases between tokens are kept as `var(--…)`.
- If two files define the same token name, the file that comes last alphabetically wins.
- `example.tokens.json` is ignored as soon as another token file is uploaded.
