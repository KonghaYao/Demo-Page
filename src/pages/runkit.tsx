import { onMount } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import { loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";

export const description: ModuleDescription = {
    title: "RunKit —— Nodejs 运行器",
    desc: "RunKit 是 NPM 官方推荐的在线 Nodejs 运行器！",
    link: ["https://runkit.com/home"],
};
/** 加载 Runkit 脚本 */
await loadScript("https://embed.runkit.com");
const RunKit = useGlobal<any>("RunKit");
export default function () {
    let runkit: HTMLDivElement;
    onMount(() => {
        RunKit.createNotebook({
            // the parent element for the new notebook
            element: runkit,
            // specify the source of the notebook
            source: '// GeoJSON!\nvar getJSON = require("async-get-json");\n\nawait getJSON("https://storage.googleapis.com/maps-devrel/google.json");',
        });
        console.log("runkit 加载完成");
    });

    return <div ref={runkit!}></div>;
}
