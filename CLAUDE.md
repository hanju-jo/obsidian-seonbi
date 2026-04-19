# obsidian-seonbi — Claude Code Guide

## Project overview

An Obsidian plugin that integrates [Seonbi](https://github.com/dahlia/seonbi) for Korean typographic transformation. Seonbi is compiled to WebAssembly and bundled via esbuild. The plugin processes rendered HTML in reading view, leaving source Markdown untouched.

## Key files

| File | Role |
|---|---|
| `src/main.ts` | Plugin entry point; registers markdown post-processor and settings tab |
| `src/seonbi.ts` | Thin wrapper around `@seonbi/wasm`; initialises the WASM module synchronously |
| `src/settings.ts` | Settings interface, defaults, and settings UI |
| `esbuild.config.mjs` | Build configuration; bundles WASM as binary, outputs `main.js` |
| `manifest.json` | Obsidian plugin manifest; version here must match the git tag on release |

## Architecture notes

- **WASM initialisation** is synchronous (`initSync`) at module load time. The WASM bytes are imported via esbuild's binary loader and passed directly to `WebAssembly.Module`.
- **SVG preservation**: before transforming, SVG elements are swapped out for placeholder `<span>` elements and restored afterward, because Seonbi does not recognise SVG tags as HTML.
- **Opt-in per note**: the post-processor checks `context.frontmatter[settings.frontmatterKey] === true` before doing anything.
- The plugin only runs inside `.markdown-reading-view`; source/live-edit views are unaffected.

## Build & dev

```bash
npm install
npm run dev      # esbuild watch — recompiles main.js on save
npm run build    # type-check + production minified build
```

Copy `main.js` and `manifest.json` to `<vault>/.obsidian/plugins/seonbi/` and reload Obsidian.

## Release workflow

Releases are automated via `.github/workflows/release.yml`. Push a tag matching `x.y.z` or `x.y.z-beta.N`; the workflow builds, verifies the tag matches `manifest.json` version, and creates a GitHub Release with `main.js` and `manifest.json` as assets.

Before tagging, bump the version in both `package.json` and `manifest.json` to the same value.

## Dependencies

- `@seonbi/wasm` — Seonbi compiled to WebAssembly (LGPL-2.1)
- `obsidian` — type definitions only (external at runtime)
- `esbuild`, `typescript` — build tooling
