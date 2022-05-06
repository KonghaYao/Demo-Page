import { createSignal, onMount } from "solid-js";
import extensions from "./extensions.json";
import { ModuleStore, updateStore } from "./ModuleStore";
import _Prism from "prismjs";
const Prism: typeof _Prism = (globalThis as any).Prism;
export const CodeViewer = (props: {
    src: string;

    languages: string[];
}) => {
    let ref: HTMLDivElement;
    const ext = props.src.replace(/.*\./, ".");
    let [language, setLanguage] = createSignal(
        /* @ts-ignore */
        ext in extensions ? extensions[ext] : "makeup"
    );
    const [code, setCode] = createSignal("");
    onMount(async () => {
        try {
            await import(
                `https://cdn.jsdelivr.net/npm/prismjs/components/prism-${language()}.min.js`
            );
        } catch (e) {
            setLanguage("markup");
        }
        console.log(language());
        const code = await fetch(new URL(props.src, window.location.href)).then(
            (res) => res.text()
        );
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
            <code ref={ref!} class={`language-${language()}`}>
                {code()}
            </code>
        </pre>
    );
};
