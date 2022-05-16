import { ModuleDescription } from "../components/ModuleDescription";
import { wrap } from "comlink";

import { CDN } from "../global";
import { createResource, For } from "solid-js";
export const description: ModuleDescription = {
    fileName: "pyodide",
    title: "pyodide —— 浏览器 Python 环境",
    desc: "",
    link: [
        "https://pyodide.org/en/stable/usage/loading-packages.html",
        "https://github.com/pyodide/pyodide",
    ],
};
const worker = new Worker(new URL("./src/utils/pyodide.js", CDN));
const api = wrap(worker);
await api.init();
export default function () {
    api.eval('print("hello-world")');
    const [packages, {}] = createResource([], async () => {
        const packs = await api.loadedPackages();
        return Object.entries(packs) as [string, string][];
    });
    return (
        <div>
            <div>Python 安装完成</div>
            <ul>
                <For each={packages()}>
                    {([name, position]) => (
                        <li>
                            {name}
                            {position}
                        </li>
                    )}
                </For>
            </ul>
        </div>
    );
}
