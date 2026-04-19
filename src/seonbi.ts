// @ts-ignore — esbuild binary loader provides Uint8Array
import wasmBytes from "@seonbi/wasm/wasm_bg.wasm";
import { initSync, transform, koKr, koKp } from "@seonbi/wasm";
import type { HanjaRenderingOption } from "@seonbi/wasm";

initSync({ module: new WebAssembly.Module(wasmBytes as BufferSource) });

export type { HanjaRenderingOption };
export type Preset = "ko-kr" | "ko-kp";

export interface Options {
  preset?: Preset;
  hanjaRendering?: HanjaRenderingOption;
}

export function seonbiTransform(html: string, options: Options = {}): string {
  console.log(html)
  const start = performance.now();
  const config = options.preset === "ko-kp" ? koKp() : koKr();
  if (options.hanjaRendering) {
    config.hanja = {
      rendering: options.hanjaRendering,
      reading: { initialSoundLaw: true, useDictionaries: ["kr-stdict"] },
    };
  }

  config.ellipsis = false;
  config.emDash = false;

  const result = transform(config, html);
  const end = performance.now();
  console.log(`Elapsed: ${end - start} milliseconds`);
  return result;
}
