import { createSignal } from "solid-js";
import "../style/dependence.css";
import type { NodeConfig, EdgeConfig } from "@antv/g6";
import { RenderMap } from "./RenderMap";
import { isURLString } from "../utils/isURLString";

type NodeMeta = {
    id: string;
    imported: { uid: string }[];
    importedBy: { uid: string }[];
};
export default function Dependence() {
    const [dependence, setDependence] = createSignal({
        nodes: [] as NodeConfig[],
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
                } else if (/https?:\//.test(value.id)) {
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
        <section class="flex flex-col bg-gray-50/20 backdrop-blur text-gray-700 p-2 overflow-y-auto h-full  justify-center">
            <RenderMap data={dependence}></RenderMap>
        </section>
    );
}
