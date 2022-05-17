import { For } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import spinnerNames from "../../assets/spinnerName.json";
import "wc-spinners";
export const description: ModuleDescription = {
    fileName: "wc-spinner",
    title: "Wc Spinners",
    desc: "Wc Spinners 是 基于 Web Component 的 Loading 动画组件",
    link: [
        "https://wc-spinners.cjennings.dev/",
        "https://github.com/craigjennings11/wc-spinners",
    ],
};

export default function () {
    return (
        <div className="p-4 grid grid-cols-5 gap-4">
            <For each={spinnerNames}>
                {(Tag) => {
                    const a = document.createElement(Tag);
                    return (
                        <div className="col-span-1 flex flex-col justify-between items-center flex-none  rounded-lg hover:bg-gray-50">
                            <span className="flex-none w-32 h-32 flex justify-center items-center">
                                {a}
                            </span>
                            <span className="text-gray-500 text-xs font-bold">
                                {Tag.replace("-spinner", "")}
                            </span>
                        </div>
                    );
                }}
            </For>
        </div>
    );
}
