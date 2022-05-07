import { onMount } from "solid-js";
import { loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";

export const description = {
    title: "RunKit —— Nodejs 运行器",
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
