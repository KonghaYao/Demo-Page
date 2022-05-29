import { onCleanup, onMount, For } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import { loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";
import { NPM } from "../global";
export const description: ModuleDescription = {
    fileName: "vanta",
    title: "vanta 3D 背景动画",
    desc: "少量代码生成漂亮的 3D 背景动画",
    link: ["https://www.vantajs.com/", "https://github.com/tengbao/vanta"],
};

// 该插件依赖 threejs 且需要锁定版本
await loadScript(NPM + "three@0.121.0/build/three.min.js");
export default function () {
    const list = [
        "birds",
        "cells",
        "clouds",
        "clouds2",
        "dots",
        "fog",
        "globe",
        "halo",
        "net",
        "rings",
        "ripple",
        "topology",
        "trunk",
        "waves",
    ];
    let el: HTMLDivElement;
    let temp: any;
    const changeBackground = async (type: string) => {
        temp?.destroy();
        await loadScript(
            NPM + `vanta@0.5.21/dist/vanta.${type.toLowerCase()}.min.js`
        );
        const module = useGlobal<any>("VANTA");
        // 具体配置请参考官网

        temp = module[type.toUpperCase()]({
            el,
        });
    };

    onMount(async () => {
        await changeBackground("BIRDS");
    });
    onCleanup(() => {
        temp?.destroy();
    });
    return (
        <div class="h-full">
            <select onchange={(e) => changeBackground(e.currentTarget.value)}>
                <For each={list}>
                    {(item) => <option value={item}>{item}</option>}
                </For>
            </select>
            <div ref={el!} className="h-full w-full"></div>
        </div>
    );
}
