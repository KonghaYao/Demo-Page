import { onMount } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import Prism from "prismjs";
import Typed from "typed.js";
export const description: ModuleDescription = {
    title: "Typed.js —— 打字效果",
    desc: "Typed.js 是 用于创建打字效果的常用插件; 这里配合 PrismJS 对代码进行格式化，形成一个动态写代码的效果",
    link: ["https://github.com/mattboldt/typed.js"],
};
const code = await fetch(
    "https://cdn.jsdelivr.net/npm/typed.js@2.0.12/app.js"
).then((res) => res.text());
const codes = [code.slice(0, 50), code, code.slice(0, 100), code];
export default function () {
    var options = {
        strings: codes.map((i) => {
            return Prism.highlight(i, Prism.languages.js, "js");
        }),
        typeSpeed: 30,
    };
    let container: HTMLDivElement;
    onMount(() => {
        var typed = new Typed(container, options);
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
