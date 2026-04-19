import { App, PluginSettingTab, Setting } from "obsidian";
import type SeonbiPlugin from "./main";
import type { HanjaRenderingOption } from "./seonbi";

export interface SeonbiSettings {
  preset: "ko-kr" | "ko-kp";
  hanjaRendering: HanjaRenderingOption;
  frontmatterKey: string;
  loadingIndicator: "statusBar" | "dim" | "none";
}

export const DEFAULT_SETTINGS: SeonbiSettings = {
  preset: "ko-kr",
  hanjaRendering: "HangulOnly",
  frontmatterKey: "seonbi",
  loadingIndicator: "statusBar",
};

export class SeonbiSettingTab extends PluginSettingTab {
  plugin: SeonbiPlugin;

  constructor(app: App, plugin: SeonbiPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Seonbi 설정" });

    new Setting(containerEl)
      .setName("프론트매터 키")
      .setDesc("이 키가 true로 설정된 파일에만 선비 변환을 적용합니다. (예: seonbi: true)")
      .addText((text) =>
        text
          .setPlaceholder("seonbi")
          .setValue(this.plugin.settings.frontmatterKey)
          .onChange(async (value) => {
            this.plugin.settings.frontmatterKey = value.trim() || "seonbi";
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("변환 중 표시 방식")
      .setDesc("선비 변환이 진행 중일 때 사용자에게 알리는 방법을 선택합니다.")
      .addDropdown((drop) =>
        drop
          .addOption("statusBar", "우하단 상태 표시줄")
          .addOption("dim", "블록 흐릿하게")
          .addOption("none", "표시 안 함")
          .setValue(this.plugin.settings.loadingIndicator)
          .onChange(async (value) => {
            this.plugin.settings.loadingIndicator = value as SeonbiSettings["loadingIndicator"];
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("언어 프리셋")
      .setDesc("한자 독음 기준 지역")
      .addDropdown((drop) =>
        drop
          .addOption("ko-kr", "한국어 (남한)")
          .addOption("ko-kp", "조선어 (북한)")
          .setValue(this.plugin.settings.preset)
          .onChange(async (value) => {
            this.plugin.settings.preset = value as "ko-kr" | "ko-kp";
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("한자 렌더링")
      .setDesc("한자를 어떻게 표시할지 선택합니다")
      .addDropdown((drop) =>
        drop
          .addOption("HangulOnly", "한글로만 표시")    
          .addOption("HanjaInRuby", "루비(독음) 병기")
          .addOption("HanjaInParentheses", "괄호 안에 독음 표시")
          .addOption("DisambiguatingHanjaInParentheses", "중의적 한자만 괄호 표시")
          .setValue(this.plugin.settings.hanjaRendering)
          .onChange(async (value) => {
            this.plugin.settings.hanjaRendering = value as HanjaRenderingOption;
            await this.plugin.saveSettings();
          })
      );
  }
}
