import {
    createSignal,
    lazy,
    Suspense,
    Show,
    onMount,
    createEffect,
    onCleanup,
} from "solid-js";
import "../style/dependence.css";
import g6, { Graph, NodeConfig, EdgeConfig, GraphData } from "@antv/g6";
const G6: typeof g6 = (globalThis as any).G6;
G6.registerNode("remote-module", {}, "circle");

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
                preventOverlap: true, // 防止节点重叠
                linkDistance: 50,
                nodeSize: 70,
            },

            defaultNode: {
                type: "rect",
                size: 16, // 节点大小
                // 节点样式配置
                style: {
                    fill: "steelblue", // 节点填充色
                    stroke: "#666", // 节点描边色
                    lineWidth: 1, // 节点描边粗细
                    opacity: 0.2,
                },

                // 节点上的标签文本配置
                labelCfg: {
                    // 节点上的标签文本样式配置
                    size: 8,
                    style: {
                        fill: "#222", // 节点标签文字颜色
                    },
                },
            },
            defaultEdge: {
                // 边样式配置
                style: {
                    opacity: 0.6, // 边透明度
                    stroke: "#aa0000", // 边描边颜色
                    endArrow: {
                        path: G6.Arrow.triangleRect(7, 7, 7, 3, 5, 15),
                        d: 5,
                        fill: "#aa0000",
                    },
                },
            },

            modes: {
                default: [
                    "drag-node",
                    "drag-canvas",
                    "zoom-canvas",
                    {
                        type: "tooltip", // 提示框
                        formatText(model) {
                            // 提示框文本内容
                            const text = "url: " + model.name;
                            return text;
                        },
                    },
                ],
            },
            nodeStateStyles: {
                // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
                hover: {
                    stroke: "#222", // 节点描边色
                },
            },
        });

        graph.data(props.data());
        graph.render();
        createEffect(() => {
            graph.clear();
            console.log("数据更新", props.data());

            graph.data(props.data());
            graph.render();
        });

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
    return <div class="relative" ref={container}></div>;
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
    (globalThis as any).RollupHub.on("drawDependence", ({ nodeMetas }: any) => {
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
        <section class="flex flex-col bg-gray-200 text-gray-700 p-2 overflow-y-auto">
            <RenderMap data={dependence}></RenderMap>
        </section>
    );
}
