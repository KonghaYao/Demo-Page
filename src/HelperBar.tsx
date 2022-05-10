import { CodeViewerEvent } from "./CodeViewer/store";
import { updateStore } from "./components/dependencePanel/ModuleStore";
import { PageSearch } from "./components/pageSearch";
import { System } from "./components/System";
import { CDN } from "./global";
import "xy-ui/components/xy-tips.js";
import { For } from "solid-js";
export function HelperBar() {
    const icons = [
        {
            value: "fitbit",
            click: () => updateStore("dependence", "show", true),
            class: ["bg-green-400"],
            tips: "打包依赖图",
        },
        {
            value: "source",
            click: () => {
                const url = new URL(`/src/pages/${System.moduleName}.tsx`, CDN);
                CodeViewerEvent.emit("showCode", url.toString());
            },
            class: ["bg-orange-400"],
            tips: "主要源代码",
        },
    ];
    return (
        <nav class="flex p-2 px-4 bg-gray-100 items-center">
            <div class="grid grid-flow-col gap-4 text-white  items-center">
                <For each={icons}>
                    {(item) => {
                        return (
                            // @ts-ignore
                            <xy-tips dir="bottom" attr:tips={item.tips}>
                                <div
                                    className={item.class.join(" ")}
                                    class="material-icons cursor-pointer rounded-full p-1 "
                                    onclick={item.click}>
                                    {item.value}
                                </div>
                                {/* @ts-ignore */}
                            </xy-tips>
                        );
                    }}
                </For>
            </div>
            <PageSearch></PageSearch>
        </nav>
    );
}
