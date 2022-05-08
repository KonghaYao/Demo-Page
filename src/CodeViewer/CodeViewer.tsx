import { createSignal, onMount } from "solid-js";
import { CDN } from "../global";
import { store, updateStore } from "./store";
import type _Prism from "prismjs";
import { loadLink, loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";
await loadScript("https://cdn.jsdelivr.net/npm/prismjs/prism.min.js");
await loadLink(
    "https://cdn.jsdelivr.net/npm/prismjs/themes/prism-solarizedlight.css"
);
const Prism = useGlobal<typeof _Prism>("Prism");
export const CodeViewer = (props: { src: string }) => {
    let container: HTMLElement;
    const [code, setCode] = createSignal("");

    onMount(async () => {
        const url = new URL(props.src, CDN);
        const code = await fetch(url).then((res) => res.text());
        const ext = url.pathname.replace(/(.*)\./, "");
        console.log(ext);
        setCode(code);
        if (code && ext) {
            console.log(ext);
            const languages = store.language.get(ext);
            console.log(languages);
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
        <pre class="backdrop-blur-xl bg-white/30 w-3/4 h-3/4 overflow-y-auto p-4 pt-2 rounded-lg">
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
