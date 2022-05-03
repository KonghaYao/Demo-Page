import { createSignal } from "solid-js";
import "../style/dependence.css";
import type { NodeConfig, EdgeConfig } from "@antv/g6";
import { RenderMap } from "./RenderMap";
import { isURLString } from "../utils/isURLString";
import { RenderFileTree } from "./RenderFileTree";

type NodeMeta = {
    id: string;
    imported: { uid: string }[];
    importedBy: { uid: string }[];
};
export default function Dependence() {
    const [dependence, setDependence] = createSignal({
        nodes: [] as (NodeConfig & { name: string })[],
        edges: [] as EdgeConfig[],
    });
    (globalThis as any).RollupHub.on("drawDependence", ({ nodeMetas }: any) => {
        // console.log(nodeMetas);
        const edges: EdgeConfig[] = [];
        const nodes = Object.entries<NodeMeta>(nodeMetas).map(
            ([uid, value]) => {
                edges.push(
                    ...value.imported.map((i) => {
                        return {
                            source: uid,
                            target: i.uid,
                        };
                    })
                );
                let type = "circle";
                let fill = "blue";
                if (value.id.startsWith(window.location.origin)) {
                    type = "local";
                    fill = "blue";
                } else if (isURLString(value.id)) {
                    type = "remote";
                    fill = "green";
                } else {
                    console.log(value.id);
                }
                return {
                    id: uid,
                    type,
                    style: { fill },

                    name: value.id,
                    label: value.id.replace(/.*\//, ""),
                };
            }
        );
        setDependence({
            nodes,
            edges,
        });
    });
    return (
        <section class="flex flex-col bg-gray-50/20 backdrop-blur text-gray-700 p-2 overflow-y-auto h-full  items-center rounded-md ">
            <div class="text-xl ">打包依赖关系图</div>
            <div class="flex-grow w-full flex overflow-hidden relative">
                <RenderFileTree data={dependence}></RenderFileTree>
                <RenderMap data={dependence}></RenderMap>
            </div>
        </section>
    );
}
