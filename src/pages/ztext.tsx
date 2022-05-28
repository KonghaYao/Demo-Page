import { onMount, For } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import chroma from "chroma-js";
import { loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";
import { GH } from "../global";
export const description: ModuleDescription = {
    fileName: "ztext",
    title: "zText 3D 文字生成",
    desc: "3D 文本动画附加",
    link: [
        "https://bennettfeely.com/ztext/#js-init",
        "https://github.com/bennettfeely/ztext",
    ],
};

// 该插件没有 npm
await loadScript(GH + "bennettfeely/ztext/src/js/ztext.min.js");

export default function () {
    let root: HTMLHeadingElement;

    onMount(() => {
        const Ztextify = useGlobal<any>("Ztextify");
        new Ztextify(".effect-3d", {
            depth: "2em",
            fade: true,
            direction: "forwards",
            event: "pointer",
            eventRotation: "40deg",
        });
    });
    return (
        <div class="h-full w-full flex justify-center items-center" ref={root!}>
            <For each={"这是一个中文字符串".split("")}>
                {(word: string, index) => {
                    return (
                        <h1
                            class="effect-3d text-4xl font-bold font-title mx-4"
                            style={{
                                color: chroma.brewer.OrRd[index() + 2],
                            }}>
                            {word}
                        </h1>
                    );
                }}
            </For>
        </div>
    );
}
