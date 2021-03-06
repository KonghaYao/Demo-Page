import { createMemo, Show } from "solid-js";
import "./dependence.css";
import type { EdgeConfig } from "@antv/g6";
import { RenderMap } from "./RenderMap";
import { isCDNLocal } from "../../utils/isURLString";
import { RenderFileTree } from "./RenderFileTree";
import { ModuleEvents, ModuleStore, updateStore } from "./ModuleStore";
import { getIconForFile } from "vscode-icons-js";
import { useGlobal } from "../../utils/useGlobal";
import { GH } from "../../global";

type NodeMeta = {
    id: string;
    imported: Set<string>;
    importedBy: { uid: string }[];
};

export const Update = async () => {
    const MapperStore = useGlobal<Map<string, any>>("MapperStore");

    const { nodeMetas } = await MapperStore.get("default")!;
    const edges: EdgeConfig[] = [];
    const nodes = Object.values<{ uid: string; meta: NodeMeta }>(nodeMetas).map(
        ({ uid, meta }) => {
            const Edges = [...meta.imported.values()].map((i) => {
                return {
                    source: uid,
                    target: i.split(",")[0],
                };
            });
            edges.push(...Edges);

            // 划分 两种不同的 加载模块
            let type = "circle";
            let fill = "blue";
            let img = "";

            const hasExt = /.*(\.\w+)$/.test(meta.id);
            if (hasExt) {
                type = "local";
                fill = "#fafafa";
                img =
                    GH +
                    "vscode-icons/vscode-icons/icons/" +
                    getIconForFile(meta.id);
            } else {
                type = "remote";
                fill = "#aaa";
                img =
                    GH + "vscode-icons/vscode-icons/icons/file_type_rollup.svg";
            }
            return {
                id: uid,
                type,
                style: { fill },
                icon: {
                    img,
                },
                name: meta.id,
                label: meta.id.replace(/.*\//, ""),
            };
        }
    );
    return { nodes, edges };
};

/** 渲染一个 依赖关系面板，但是必须要全局 RollupHub 支持 */
export default function Dependence() {
    Update().then((res) => {
        updateStore("dependence", "mapper", res);
        ModuleEvents.emit("filterUpdate", {});
    });
    const fileTreeShow = createMemo(
        () => ModuleStore.dependence.renderFileTree.show
    );

    return (
        <section className="flex flex-col bg-gray-50/70 backdrop-blur text-gray-700 p-2 overflow-y-auto h-full  items-center rounded-md ">
            <div className="text-xl flex justify-between w-full p-2 items-center">
                <span
                    onclick={() =>
                        updateStore(
                            "dependence",
                            "renderFileTree",
                            "show",
                            !fileTreeShow()
                        )
                    }
                    className="material-icons">
                    {fileTreeShow()
                        ? "keyboard_arrow_right"
                        : "keyboard_arrow_left"}
                </span>
                打包依赖关系图
                <span
                    className="material-icons"
                    onclick={() => updateStore("dependence", "show", false)}>
                    close
                </span>
            </div>
            <div className="flex-grow w-full flex overflow-hidden relative justify-center">
                <Show when={fileTreeShow()}>
                    <RenderFileTree></RenderFileTree>
                </Show>
                <RenderMap></RenderMap>
            </div>
        </section>
    );
}
