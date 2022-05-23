import { createComputed, createSignal, onMount } from "solid-js";
import { CDN, NPM } from "../global";
import { CodeViewerEvent, store, updateStore } from "./store";
import type _Prism from "prismjs";
import { loadLink, loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";
import { jumpTo } from "../utils/jumpTo";
import { isLocal } from "../utils/isURLString";
const remote = "https://fastly.jsdelivr.net/npm/prismjs/";
await loadScript(remote + "prism.min.js");
await loadLink(
    "https://fastly.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-material-light.min.css"
);
const MapperStore = useGlobal<Map<string, any[]>>("MapperStore");
/** 添加代码链接 */
const addLinkToURL = (
    Pre: HTMLPreElement,
    cb: (url: string) => void,
    baseURL = CDN
) => {
    for (let el of Pre.querySelectorAll<HTMLSpanElement>("span.token.string")) {
        if (el.textContent) {
            const puleText = el.textContent!.replace(/\'|\"|\`/g, "");
            const isURL = ["./", "../", "http"].some((i) =>
                puleText.startsWith(i)
            );

            if (isURL) {
                el.classList.add(
                    "underline",
                    "underline-offset-1",
                    "cursor-pointer"
                );
                el.addEventListener("click", (e) => {
                    const url = new URL(puleText, baseURL).toString();

                    // 补全 后缀名
                    // 使用打包记录尝试获取有后缀名的代码即可
                    let Url = url;
                    const reg = new RegExp(`^${url}[^\/]*`);
                    const isBundle = MapperStore.get("default")?.some((i) => {
                        const id = Object.keys(i.getNodeMetas()).find(
                            (moduleId) => {
                                return reg.test(moduleId);
                            }
                        );
                        if (id) {
                            Url = id;
                            return true;
                        }
                    });
                    console.log(MapperStore.get("default"));
                    console.log("查找打包记录 ", isBundle);
                    e.ctrlKey || !isLocal(Url) ? jumpTo(Url) : cb(Url);
                });
            }
        }
    }
};

/** 用于存储查看历史 */
class HistoryRecord {
    private history: string[] = [];
    constructor() {}
    current: string | null = null;
    push(str: string) {
        if (this.history[this.history.length - 1] !== str) {
            this.current && this.history.push(this.current);
            this.current = str;
        }
    }
    back() {
        return this.history.pop();
    }
}
await loadScript(NPM + "prismjs/prism.min.js");
await loadLink(NPM + "prismjs/themes/prism-okaidia.css");
const Prism = useGlobal<typeof _Prism>("Prism");
export const CodeViewer = (props: { src: string }) => {
    let container: HTMLPreElement;
    const history = new HistoryRecord();
    const [code, setCode] = createSignal("");

    const reload = async () => {
        const url = new URL(props.src, CDN);
        const code = await fetch(url.toString()).then((res) => res.text());
        const ext = url.pathname.replace(/(.*)\./, "");
        setCode(code);
        if (code && ext) {
            const languages = store.language.get(ext);
            if (languages) {
                const languageName = languages[0];

                // 加载语言包，加载不会重复
                await languages.reverse().reduce((promise, i) => {
                    return promise.then(() =>
                        loadScript(NPM + `prismjs/components/prism-${i}.js`)
                    );
                }, Promise.resolve(true));

                const html = Prism.highlight(
                    code,
                    Prism.languages[languageName],
                    languageName
                );
                setCode(html);
                history.push(props.src);
                setTimeout(() => {
                    addLinkToURL(
                        container,
                        (url) => {
                            CodeViewerEvent.emit("showCode", url);
                        },
                        props.src
                    );
                }, 500);
            }
        }
    };
    createComputed(reload);
    onMount(reload);
    const goBack = () => {
        const url = history.back();
        url && CodeViewerEvent.emit("showCode", url);
    };

    return (
        <div className="flex flex-col h-3/4 w-3/4">
            <div className="flex justify-between p-2 text-sky-400">
                <span
                    className="material-icons cursor-pointer"
                    onclick={goBack}>
                    keyboard_arrow_left
                </span>
                <span
                    className="flex-grow text-center hover:underline underline-offset-1 cursor-pointer"
                    onclick={() => jumpTo(props.src)}>
                    {props.src}
                </span>
                <span
                    className="material-icons cursor-pointer"
                    onclick={() => updateStore("show", !store.show)}>
                    close
                </span>
            </div>
            <pre
                ref={container!}
                className="w-full flex-grow whitespace-pre-wrap shadow-2xl bg-white h-3/4 overflow-y-auto p-4 pt-2 rounded-2xl  ">
                <code class={`prism-code`} innerHTML={code()}></code>
            </pre>
        </div>
    );
};
