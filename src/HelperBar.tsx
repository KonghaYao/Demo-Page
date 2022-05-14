import { CodeViewerEvent } from "./CodeViewer/store";
import { updateStore } from "./components/dependencePanel/ModuleStore";
import { PageSearch } from "./components/pageSearch";
import { System } from "./components/System";
import { CDN } from "./global";
import "xy-ui/components/xy-tips.js";
import { For } from "solid-js";
import { router } from "./router/index";

const defaultClass = " material-icons cursor-pointer rounded-full p-1 ";
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
                const route = router.matchLocation("/page/:pageName");
                if (route && route.data) {
                    const url = new URL(
                        `./src/pages/${route.data.pageName}.tsx`,
                        CDN
                    );
                    CodeViewerEvent.emit("showCode", url.toString());
                }
            },
            class: ["bg-orange-400"],
            tips: "主要源代码",
        },
        {
            value: "home",
            click: () => {
                router.navigate("/");
            },
            class: ["bg-blue-400"],
            tips: "返回列表",
        },
    ];
    return (
        <nav className="flex p-2 px-12 bg-gray-100 items-center">
            <div className="grid grid-flow-col gap-4 text-white  items-center">
                <For each={icons}>
                    {(item) => {
                        return (
                            // @ts-ignore
                            <xy-tips dir="bottom" attr:tips={item.tips}>
                                <div
                                    className={
                                        item.class.join(" ") + defaultClass
                                    }
                                    onclick={item.click}>
                                    {item.value}
                                </div>
                                {/* @ts-ignore */}
                            </xy-tips>
                        );
                    }}
                </For>
            </div>
            <div className="flex-grow"></div>
            <PageSearch></PageSearch>
        </nav>
    );
}
