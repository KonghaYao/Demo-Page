import { createMemo, Show } from "solid-js";
import "./dependence.css";
import type { EdgeConfig } from "@antv/g6";
import { RenderMap } from "./RenderMap";
import {  isCDNLocal } from "../../utils/isURLString";
import { RenderFileTree } from "./RenderFileTree";
import { ModuleStore, updateStore } from "./ModuleStore";
import { fromEvent, map } from "rxjs";
import { Emitter } from "mitt";
import { getIconForFile } from "vscode-icons-js";
import { useGlobal } from "../../utils/useGlobal";
type NodeMeta = {
    id: string;
    imported: { uid: string }[];
    importedBy: { uid: string }[];
};
const RollupHub = useGlobal<
    Emitter<{
        drawDependence: any;
    }>
>("RollupHub");
const Update = fromEvent(RollupHub, "drawDependence").pipe(
    map(({ nodeMetas }: any) => {
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
                // 划分 两种不同的 加载模块
                let type = "circle";
                let fill = "blue";
                let img = "";
                if (isCDNLocal(value.id)) {
                    type = "local";
                    fill = "#fafafa";
                    img =
                        "https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/" +
                        getIconForFile(value.id);
                } else {
                    type = "remote";
                    fill = "#aaa";
                    img =
                        "https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/file_type_rollup.svg";
                }
                return {
                    id: uid,
                    type,
                    style: { fill },
                    icon: {
                        img,
                    },

                    name: value.id,
                    label: value.id.replace(/.*\//, ""),
                };
            }
        );
        return { nodes, edges };
    })
);
Update.subscribe((mapper) => {
    updateStore("dependence", "mapper", mapper);
    console.log("%c 依赖记录完成");
});
/** 渲染一个 依赖关系面板，但是必须要全局 RollupHub 支持 */
export default function Dependence() {
    const fileTreeShow = createMemo(
        () => ModuleStore.dependence.renderFileTree.show
    );

    return (
        <section class="flex flex-col bg-gray-50/20 backdrop-blur text-gray-700 p-2 overflow-y-auto h-full  items-center rounded-md ">
            <div class="text-xl flex justify-between w-full p-2 items-center">
                <span
                    onclick={() =>
                        updateStore(
                            "dependence",
                            "renderFileTree",
                            "show",
                            !fileTreeShow()
                        )
                    }
                    class="material-icons">
                    {fileTreeShow()
                        ? "keyboard_arrow_right"
                        : "keyboard_arrow_left"}
                </span>
                打包依赖关系图
                <span
                    class="material-icons"
                    onclick={() => updateStore("dependence", "show", false)}>
                    close
                </span>
            </div>
            <div class="flex-grow w-full flex overflow-hidden relative justify-center">
                <Show when={fileTreeShow()}>
                    <RenderFileTree></RenderFileTree>
                </Show>
                <RenderMap></RenderMap>
            </div>
        </section>
    );
}
