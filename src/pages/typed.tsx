import { onMount } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import Typed from "typed.js";
import { NPM } from "../global";
import { loadLink, loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";
export const description: ModuleDescription = {
    fileName: "typed",
    title: "Typed.js —— 打字效果",
    desc: "Typed.js 是 用于创建打字效果的常用插件; 这里配合 PrismJS 对代码进行格式化，形成一个动态写代码的效果",
    link: ["https://github.com/mattboldt/typed.js"],
};

/** 远程代码 */
const code = await fetch(NPM + "typed.js@2.0.12/app.js").then((res) =>
    res.text()
);

await Promise.all([
    loadScript(NPM + "prismjs/prism.min.js"),
    loadLink(NPM + "prism-themes@1.9.0/themes/prism-material-light.min.css"),
]);
const Prism = useGlobal<typeof import("prismjs")>("Prism");
export default function () {
    /* 代码序列 */
    const codes = [code.slice(0, 50), code, code.slice(0, 100), code].map(
        (i) => {
            /* 高亮一下代码 */
            return Prism.highlight(i, Prism.languages.js, "js");
        }
    );
    let container: HTMLDivElement;
    onMount(() => {
        const typed = new Typed(container, {
            strings: codes,
            typeSpeed: 30,
        });
        typed.start();
    });

    return (
        <div>
            <pre>
                <code ref={container!}></code>;
            </pre>
        </div>
    );
}
