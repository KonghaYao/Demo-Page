import { createSignal, onMount } from "solid-js";

import type _Prism from "prismjs";
import "https://cdn.jsdelivr.net/npm/prismjs";
import "https://cdn.jsdelivr.net/npm/prismjs@1.28.0/plugins/autoloader/prism-autoloader.min.js";
import { ModuleStore, updateStore } from "./ModuleStore";
const Prism = (globalThis as any).Prism as typeof _Prism;
Prism.plugins.autoloader.languages_path =
    "https://cdn.jsdelivr.net/npm/prismjs@1.28.0/components/";
Prism.plugins.autoloader.use_minified = false;
export const CodeViewer = (props: { src: string; language?: string[] }) => {
    let ref: HTMLDivElement;
    const ext = props.src.replace(/.*\./, "");
    const [code, setCode] = createSignal("");
    onMount(async () => {
        const code = await fetch(props.src).then((res) => res.text());
        setCode(code);
        Prism.highlightElement(ref);
    });

    return (
        <pre class="backdrop-blur-xl bg-white/30 w-3/4 h-3/4 overflow-y-auto p-4 pt-2 rounded-lg">
            <div class="flex justify-end p-2">
                <span
                    class="material-icons"
                    onclick={() => updateStore("codeViewer", "show", false)}>
                    close
                </span>
            </div>
            <code
                className={`language-${ext}`}
                data-dependencies={
                    props.language ? props.language.concat(ext) : ext
                }>
                {code}
            </code>
        </pre>
    );
};
