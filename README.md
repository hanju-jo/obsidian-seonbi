# obsidian-seonbi

> [!IMPORTANT]
> This plugin is currently in **beta**. It is not yet listed in the Obsidian community plugin directory. You can try it now via [BRAT](https://github.com/TfTHacker/obsidian42-brat).

An [Obsidian](https://obsidian.md) plugin that applies [Seonbi](https://github.com/dahlia/seonbi) typographic transformations to your notes in reading view.

Seonbi is a tool for beautifying Korean text: it corrects punctuation, applies proper quotation marks, and optionally renders Hanja (Chinese characters used in Korean) with Hangul readings.

## Features

- Applies Seonbi transformations automatically in reading view
- Opt-in per note via a frontmatter key (default: `seonbi: true`)
- Supports South Korean (`ko-kr`) and North Korean (`ko-kp`) presets
- Hanja rendering options:
  - Hangul only (replace Hanja with Hangul reading)
  - Ruby annotation (`<ruby>`)
  - Parentheses
  - Parentheses for ambiguous Hanja only
- Loading indicator: status bar, dim effect, or none

## Usage

Add `seonbi: true` to the frontmatter of any note you want transformed:

```yaml
---
seonbi: true
---

國漢文混用體 문장이 여기에 들어갑니다.
```

###### Reading View: Hangul only

```
국한문 혼용체 문장이 여기에 들어갑니다.
```

###### Reading View: Parenthesis

```
국한문 혼용체(國漢文混用體) 문장이 여기에 들어갑니다.
```

###### Reading View: Ruby annotation

![](/assets/example-ruby.png)

```
<ruby>國漢文混用體<rp>(</rp><rt>국한문 혼용체</rt><rp>)</rp></ruby> 문장이 여기에 들어갑니다.
```


The plugin transforms the note in reading view only; your source text is never modified.


## Installation

This plugin is not yet listed in the Obsidian community plugin directory. To install manually:

1. Download `main.js` and `manifest.json` from the [latest release](../../releases/latest).
2. Copy them into `<vault>/.obsidian/plugins/seonbi/`.
3. Reload Obsidian and enable **Seonbi** in Settings → Community plugins.

## Settings

| Setting | Description | Default |
|---|---|---|
| Frontmatter key | Frontmatter key that enables transformation | `seonbi` |
| Loading indicator | How to signal that transformation is in progress | Status bar |
| Language preset | Region for Hanja readings (`ko-kr` / `ko-kp`) | `ko-kr` |
| Hanja rendering | How to display Hanja characters | Hangul only |

## Development

```bash
npm install
npm run dev      # watch mode, outputs main.js
npm run build    # production build
```

Copy `main.js` and `manifest.json` into your vault's plugin folder to test.

This plugin uses the `@seonbi/wasm` package, which is made possible by [moreal/seonbi-rs](https://github.com/moreal/seonbi-rs) — a Rust port of Seonbi that compiles to WebAssembly.

## License

This project follows the license of the original [dahlia/seonbi](https://github.com/dahlia/seonbi) repository and is distributed under the LGPL-2.1-or-later license. 
