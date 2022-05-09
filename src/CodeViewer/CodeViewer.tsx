import { createComputed, createEffect, createMemo, createSignal, observable, onMount } from "solid-js";
import { CDN } from "../global";
import { CodeViewerEvent, store, updateStore } from "./store";
import type _Prism from "prismjs";
import { loadLink, loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";
import { jumpTo } from "../utils/jumpTo";
const remote = "https://cdn.jsdelivr.net/npm/prismjs/"
await loadScript(remote + "prism.min.js");
await loadLink(
    "https://cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-material-light.min.css"
);

/** 添加代码链接 */
const addLinkToURL = (Pre: HTMLPreElement, cb: (url: string) => void, baseURL = CDN) => {
    for (let el of Pre.querySelectorAll<HTMLSpanElement>('span.token.string')) {
        if (el.textContent) {
            const puleText = el.textContent!.replace(/\'|\"|\`/g, '')
            const isURL = ['./', '../', 'http'].some(i => puleText.startsWith(i))

            if (isURL) {
                el.classList.add('underline', 'underline-offset-1', 'cursor-pointer')
                el.addEventListener('click', (e) => {
                    const url = new URL(puleText, baseURL).toString()
                    e.ctrlKey ? jumpTo(url) : cb(url)
                })
            }
        }
    }
}

/** 用于存储查看历史 */
class HistoryRecord {
    private history: string[] = []
    constructor() {

    }
    current: string | null = null
    push(str: string) {
        if (this.history[this.history.length - 1] !== str) {

            this.current && this.history.push(this.current)
            this.current = str
        }
    }
    back() {
        return this.history.pop()
    }
}
const Prism = useGlobal<typeof _Prism>("Prism");
export const CodeViewer = (props: { src: string }) => {
    let container: HTMLPreElement;
    const history = new HistoryRecord()
    const [code, setCode] = createSignal("");

    const reload = async () => {
        const url = new URL(props.src, CDN);
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
                history.push(props.src)
                setTimeout(() => {
                    addLinkToURL(container, (url) => {

                        CodeViewerEvent.emit('showCode', url)
                    }, props.src)
                }, 500)
            }
        }
    }
    createComputed(reload)
    onMount(reload)
    const goBack = () => {
        const url = history.back()!
        console.log(url);
        CodeViewerEvent.emit('showCode', url)
    }

    return (
        <div class="flex flex-col h-3/4 w-3/4">
            <div class="flex justify-between p-2 text-sky-400">

                <span
                    class="material-icons cursor-pointer"
                    onclick={goBack}
                >
                    keyboard_arrow_left
                </span>
                <span class="flex-grow text-center hover:underline underline-offset-1 cursor-pointer" onclick={() => jumpTo(props.src)}>{props.src}</span>
                <span
                    class="material-icons cursor-pointer"
                    onclick={() => updateStore("show", !store.show)}>
                    close
                </span>
            </div>
            <pre ref={container!} class="w-full flex-grow whitespace-pre-wrap shadow-2xl bg-white h-3/4 overflow-y-auto p-4 pt-2 rounded-2xl  ">
                <code
                    class={`prism-code`}
                    innerHTML={code()} ></code>
            </pre>
        </div>
    );
};
