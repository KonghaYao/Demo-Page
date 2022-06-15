import { createSignal, onMount } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import { GH } from "../global";
import { loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";

export const description: ModuleDescription = {
    fileName: "drawio",
    title: "Draw.io 流程图支持",
    desc: "在网页端打开 drawio 格式的流程图！",
    link: ["https://github.com/jgraph/drawio"],
};
await loadScript(GH + "jgraph/drawio/src/main/webapp/js/viewer.min.js");
const xml = await fetch(GH + "KonghaYao/docsify-drawio/test.drawio").then(
    (res) => res.text()
);

export default function () {
    const [source, {}] = createSignal({
        editable: false,
        highlight: "#0000ff",
        nav: false,
        center: true,
        edit: null,
        resize: true,
        move: true,
        responsive: true,
        zoomEnabled: true,
        xml,
    });
    const GraphViewer = useGlobal<any>("GraphViewer");
    let container: HTMLDivElement;
    let Graph: any;
    onMount(() => {
        const mxUtils = useGlobal<any>("mxUtils");
        Graph = new GraphViewer(
            container,
            mxUtils.parseXml(xml).documentElement,
            source()
        );
        console.log(Graph);
    });
    return (
        <div class="h-full w-full flex flex-col">
            <div>
                <input type="file"></input>
            </div>
            <div class="flex-grow">
                <div ref={container!}></div>
            </div>
        </div>
    );
}
