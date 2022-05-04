import { createMemo, createSignal, For } from "solid-js";
import { NodeConfig, EdgeConfig } from "@antv/g6";
import { getIconForFile } from "vscode-icons-js";
import { ModuleEvents } from "./ModuleStore";
import { fromEventPattern } from "rxjs";
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
    update?: () => void;
}) => {
    const [searchText, setSearchText] = createSignal("");

    const searchRegExp = createMemo(() => {
        try {
            const text = searchText();
            return text ? new RegExp(text) : null;
        } catch (e) {
            return null;
        }
    });
    const fileList = createMemo(() => {
        const reg = searchRegExp();
        const data = props.data().nodes;
        const edges = props.data().edges;
        if (reg) {
            const result = data.filter((node) => {
                const isIn = reg.test(node.name);
                node.visible = isIn;
                return isIn;
            });
            const ids = result.map((i) => i.id);
            reg &&
                edges.forEach((i) => {
                    const isIn =
                        ids.includes(i.source!) && ids.includes(i.target!);
                    i.visible = isIn;
                });
            ModuleEvents.emit("filterUpdate", {});
            return result;
        }

        return data;
    });
    return (
        <div class="flex-none h-full overflow-hidden absolute z-10 flex flex-col backdrop-blur-lg bg-gray-100/60 px-2">
            <input
                type="search"
                placeholder="请输入正则表达式"
                oninput={(e) => setSearchText(e.currentTarget.value)}
            />
            <div class="overflow-y-auto flex-grow">
                <For each={fileList()}>{renderRow}</For>
            </div>
        </div>
    );
};
