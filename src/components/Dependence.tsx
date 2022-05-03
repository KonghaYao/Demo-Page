import {
    createSignal,
    lazy,
    Suspense,
    Show,
    onMount,
    createEffect,
    onCleanup,
} from "solid-js";
import g6, { Graph, NodeConfig, EdgeConfig, GraphData } from "@antv/g6";
const G6: typeof g6 = (globalThis as any).G6;
const RenderMap = (props: { data(): GraphData }) => {
    let container!: HTMLDivElement;
    let graph: Graph;
    onMount(() => {
        graph = new G6.Graph({
            container,
            width: 400,
            height: 300,
            layout: {
                type: "force",
            },
            defaultNode: {
                size: 16, // 节点大小
                // 节点样式配置
                style: {
                    fill: "steelblue", // 节点填充色
                    stroke: "#666", // 节点描边色
                    lineWidth: 1, // 节点描边粗细
                },
                // 节点上的标签文本配置
                labelCfg: {
                    // 节点上的标签文本样式配置
                    style: {
                        fill: "#222", // 节点标签文字颜色
                        opacity: 0.2,
                    },
                },
            },
            defaultEdge: {
                // 边样式配置
                style: {
                    opacity: 0.6, // 边透明度
                    stroke: "#ff0000", // 边描边颜色
                },
            },
            modes: {
                default: [
                    {
                        type: "collapse-expand",
                        onChange(item, collapsed) {
                            const data = item!.get("model");
                            data.collapsed = collapsed;
                            return true;
                        },
                    },
                    "drag-canvas",
                    "zoom-canvas",
                ],
            },
        });

        graph.data(props.data());
        graph.render();
        createEffect(() => {
            console.log("数据更新", props.data());

            graph.data(props.data());
            graph.render();
        });
        graph.fitView();

        if (typeof window !== "undefined")
            window.onresize = () => {
                if (!graph || graph.get("destroyed")) return;
                if (
                    !container ||
                    !container.scrollWidth ||
                    !container.scrollHeight
                )
                    return;
                graph.changeSize(container.scrollWidth, container.scrollHeight);
            };
    });
    onCleanup(() => {
        graph.destroy();
    });
    return <div ref={container}></div>;
};
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
    (globalThis as any).RollupHub.on(
        "drawDependence",
        ({ nodeMetas, nodeParts }: any) => {
            console.log(nodeParts);
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
                    return {
                        id: uid,
                        label: value.id,
                    };
                }
            );
            setDependence({
                nodes,
                edges,
            });
        }
    );
    return (
        <section class="flex flex-col bg-gray-200 text-gray-700 p-2 overflow-y-auto">
            <RenderMap data={dependence}></RenderMap>
        </section>
    );
}
