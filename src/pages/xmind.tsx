import { createEffect, createResource, createSignal, onMount } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";

// 修改一下 插件里面 的 iframe 地址，让其指向我的加速网页
/** 原本仓库为  xmind-embed-viewer */
import { XMindEmbedViewer } from "../utils/xmind/index";

export const description: ModuleDescription = {
    fileName: "xmind",
    title: "XMind 思维导图支持",
    desc: "在网页端打开思维导图",
    link: [
        "https://www.xmind.cn/",
        "https://github.com/xmindltd/xmind-embed-viewer",
    ],
};

export default function () {
    let el: HTMLDivElement;
    const [file, { mutate, refetch }] = createResource(async () => {
        return fetch("./assets/test-1.xmind").then((res) => {
            return res.arrayBuffer();
        });
    });
    createEffect(() => {
        el.innerHTML = "";
        new XMindEmbedViewer({
            el,
            file: file(),
            url: new URL(
                "./assets/xmind.html",
                window.location.href
            ).toString(),
        });
    });
    return (
        <div class="flex flex-col justify-center items-center h-full w-full">
            <div class="flex ">
                <input
                    type="file"
                    oninput={async (e) => {
                        const file =
                            await e.currentTarget.files![0].arrayBuffer();
                        mutate(file);
                    }}></input>
                <div class="text-sm">
                    xmind
                    官网在线加载较慢，所以在我的项目里面加速了一下官方的网页
                </div>
            </div>
            <div class="rounded-lg overflow-hidden" ref={el!}></div>
        </div>
    );
}
