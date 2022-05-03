import { For } from "solid-js";
import { NodeConfig, EdgeConfig } from "@antv/g6";
import { getIconForFile } from "vscode-icons-js";

/** 渲染一行文件 */
const renderRow = (item: NodeConfig & { name: string }) => {
    return (
        <div class="flex items-center cursor-default button-like">
            <img
                class="h-4 w-4 mx-2"
                src={
                    "https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/" +
                    getIconForFile(item.name)
                }
            />
            {item.name as string}
        </div>
    );
};

export const RenderFileTree = (props: {
    data(): {
        nodes: (NodeConfig & { name: string })[];
        edges: EdgeConfig[];
    };
}) => {
    return (
        <div class="flex-none h-full overflow-y-auto absolute z-10">
            <For each={props.data().nodes}>{renderRow}</For>
        </div>
    );
};
