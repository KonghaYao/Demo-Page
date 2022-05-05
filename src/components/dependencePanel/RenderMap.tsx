import { onMount, createEffect, onCleanup } from "solid-js";
import g6, { Graph, GraphData } from "@antv/g6";
import { ModuleEvents } from "./ModuleStore";
import { debounceTime, Subscription, fromEvent } from "rxjs";
const G6: typeof g6 = (globalThis as any).G6;

const updater$ = fromEvent(ModuleEvents, "filterUpdate");
const createGraph = (container: HTMLElement) =>
    new G6.Graph({
        fitView: true,
        container,
        layout: {
            type: "force",
            nodeStrength: -300,
            preventOverlap: true,
            workerEnabled: true,
        },
        width: 600,
        height: 300,
        defaultNode: {
            // 节点样式配置
            style: {
                fill: "steelblue",
                stroke: "#666",
                lineWidth: 1,
                opacity: 0.2,
            },
            icon: {
                show: true,
            },
            // 节点上的标签文本配置
            labelCfg: {
                position: "bottom",
                // 节点上的标签文本样式配置
                size: 4,
                style: {
                    opacity: 0.2,
                    fill: "#222", // 节点标签文字颜色
                },
            },
        },
        defaultEdge: {
            // 边样式配置
            style: {
                opacity: 0.2,
                stroke: "#aa1100",
                endArrow: {
                    path: G6.Arrow.triangleRect(7, 7, 7, 3, 5, 15),
                    d: 5,
                    fill: "#aa1100",
                },
            },
        },

        modes: {
            default: [
                "drag-canvas",
                "zoom-canvas",
                {
                    type: "tooltip",
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

export const RenderMap = (props: { data(): GraphData }) => {
    let updater: null | Subscription;
    let container!: HTMLDivElement;
    let graph: Graph;

    onMount(() => {
        graph = createGraph(container);
        graph.data(props.data());
        graph.render();
        updater = updater$.subscribe(() => {
            update();
        });
        // 更新视图
        const update = () => {
            graph.clear();
            console.log("数据更新", props.data());

            graph.data(props.data());
            graph.render();
        };

        createEffect(() => ModuleEvents.emit("filterUpdate", {}));
    });
    onCleanup(() => {
        graph.destroy();
        updater?.unsubscribe();
    });
    return <div class="relative drop-shadow-md" ref={container}></div>;
};