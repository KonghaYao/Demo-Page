import { createEffect, createSignal, onMount } from "solid-js";
import { CDN } from "../global";
import { store, updateStore } from "./store";
import type _Prism from "prismjs";
import { loadLink, loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";
await loadScript("https://cdn.jsdelivr.net/npm/prismjs/prism.min.js");
await loadLink(
    "https://cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-material-light.min.css"
);
const Prism = useGlobal<typeof _Prism>("Prism");
export const CodeViewer = (props: { src: string }) => {
    let container: HTMLElement;
    const [code, setCode] = createSignal("");

    onMount(async () => {
        const url = new URL(props.src, CDN);
        console.log(url.toString());
        const code = await fetch(url).then((res) => res.text());
        const ext = url.pathname.replace(/(.*)\./, "");
        setCode(code);
        if (code && ext) {
            const languages = store.language.get(ext);
            if (languages) {
                const languageName = languages[0];
                for (let i of languages.reverse()) {
                    await loadScript(
                        `https://cdn.jsdelivr.net/npm/prismjs/components/prism-${i}.js`
                    );
                }

                const html = Prism.highlight(
                    code,
                    Prism.languages[languageName],
                    languageName
                );
                setCode(html);
            }
        }
    });

    return (
        <pre class=" shadow-2xl bg-white w-3/4 h-3/4 overflow-y-auto p-4 pt-2 rounded-2xl">
            <div class="flex justify-end p-2">
                <span
                    class="material-icons"
                    onclick={() => updateStore("show", !store.show)}>
                    close
                </span>
            </div>
            <code
                ref={container!}
                class={`prism-code`}
                innerHTML={code()}></code>
        </pre>
    );
};
