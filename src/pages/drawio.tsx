import {
    createEffect,
    createMemo,
    createResource,
    createSignal,
    Match,
    onMount,
    Switch,
} from "solid-js";
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
import "@shoelace-style/shoelace/dist/components/input/input.js";
import { Loading } from "../components/LoadingPage/loading";
export default function () {
    const [fileUrl, setFileUrl] = createSignal(
        //  https://fastly.jsdelivr.net/gh/jgraph/drawio/src/main/webapp/templates/flowcharts/epc.xml
        GH +
            "jgraph/drawio/src/main/webapp/templates/flowcharts/cross_functional_flowchart_2.xml"
    );
    const [xml, { mutate: setXML, refetch }] = createResource(() => {
        return fetch(fileUrl()).then((res) => res.text());
    });
    const source = createMemo(() => ({
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
    }));
    const GraphViewer = useGlobal<any>("GraphViewer");
    const mxUtils = useGlobal<any>("mxUtils");
    let container: HTMLDivElement;
    let Graph: any;

    createEffect(() => {
        console.log(Graph);
        if (Graph) {
            Graph.graph.destroy();
            Graph.editor.destroy();
        }
        if (xml()) {
            Graph = new GraphViewer(
                container,
                mxUtils.parseXml(xml()).documentElement,
                source()
            );
        }
    });
    return (
        <div class="h-full w-full flex flex-col relative">
            <Switch>
                <Match when={xml.loading}>
                    <div class="z-50 absolute top-0 left-0 h-full w-full backdrop-blur-sm">
                        <Loading></Loading>
                    </div>
                </Match>
            </Switch>
            <div class="flex justify-around">
                <input
                    type="file"
                    oninput={async (e) => {
                        const file: File = (e.target as any).files[0];
                        const xmlText = await file.text();
                        setXML(xmlText);
                    }}></input>
                <sl-input
                    type="search"
                    input-mode="search"
                    on:sl-change={async (e: any) => {
                        setFileUrl(e.target.value);
                        refetch();
                    }}></sl-input>
            </div>
            <div class="flex-grow">
                <div ref={container!}></div>
            </div>
        </div>
    );
}
