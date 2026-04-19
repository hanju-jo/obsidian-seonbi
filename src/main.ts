import { MarkdownView, Plugin } from "obsidian";
import { seonbiTransform } from "./seonbi";
import { DEFAULT_SETTINGS, SeonbiSettings, SeonbiSettingTab } from "./settings";

// Hangul syllables, Jamo, Compatibility Jamo, CJK (Hanja)
const SEONBI_RE = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\u4E00-\u9FFF]/;

export default class SeonbiPlugin extends Plugin {
  settings: SeonbiSettings = DEFAULT_SETTINGS;

  private pendingCount = 0;
  private statusBarItem: HTMLElement | null = null;
  private styleEl: HTMLStyleElement | null = null;

  private setPending(delta: number) {
    this.pendingCount += delta;
    if (this.statusBarItem && this.settings.loadingIndicator === "statusBar") {
      this.statusBarItem.setText(this.pendingCount > 0 ? "Seonbi Transforming…" : "");
    }
  }

  override async onload() {
    await this.loadSettings();

    this.statusBarItem = this.addStatusBarItem();

    this.styleEl = document.head.createEl("style", { attr: { id: "seonbi-plugin-styles" } });
    this.styleEl.textContent = `.seonbi-transforming { opacity: 0.35; transition: opacity 0.12s ease; }`;

    this.registerMarkdownPostProcessor(async (element, context) => {
      if (!element.closest(".markdown-reading-view")) return;
      
      const key = this.settings.frontmatterKey;
      if (!context.frontmatter || context.frontmatter[key] !== true) return;

      if (!SEONBI_RE.test(element.textContent ?? "")) return;

      if (!element.innerHTML.trim()) return;

      if (this.settings.loadingIndicator === "dim")
        element.addClass("seonbi-transforming");
      this.setPending(+1);

      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      try {
        // Seonbi doesn't recognize SVG as HTML tags, so we replace SVG elements
        // with placeholders before transforming and restore them afterward.
        const svgMap = new Map<string, Element>();
        element.querySelectorAll("svg").forEach((svg, i) => {
          const key = `seonbi-svg-${i}`;
          const placeholder = document.createElement("span");
          placeholder.setAttribute("data-seonbi-svg", key);
          svg.replaceWith(placeholder);
          svgMap.set(key, svg);
        });

        element.innerHTML = seonbiTransform(element.innerHTML, {
          preset: this.settings.preset,
          hanjaRendering: this.settings.hanjaRendering,
        });

        svgMap.forEach((svg, key) => {
          element.querySelector(`[data-seonbi-svg="${key}"]`)?.replaceWith(svg);
        });
      } catch (e) {
        console.error("Seonbi transform failed:", e);
      } finally {
        element.removeClass("seonbi-transforming");
        this.setPending(-1);
      }
    });

    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        this.app.workspace.iterateAllLeaves((leaf) => {
          if (
            leaf.view instanceof MarkdownView &&
            leaf.view.file === file &&
            leaf.view.getMode() === "preview"
          ) {
            leaf.view.previewMode.rerender(true);
          }
        });
      })
    );

    this.addSettingTab(new SeonbiSettingTab(this.app, this));
  }

  override onunload() {
    this.statusBarItem?.remove();
    this.styleEl?.remove();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
