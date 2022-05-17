import { createEffect, createResource, createSignal, onMount } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import { XMindEmbedViewer } from "xmind-embed-viewer";
export const description: ModuleDescription = {
    fileName: "xmind",
    title: "XMind 思维导图支持",
    desc: "在网页端打开思维导图",
    link: ["https://github.com/xmindltd/xmind-embed-viewer"],
};

export default function () {
    let el: HTMLDivElement;
    const [file, { mutate, refetch }] = createResource(async () => {
        return fetch(
            "https://cdn.jsdelivr.net/gh/xmind-embed-viewer/public/test-1.xmind"
        ).then((res) => res.arrayBuffer());
    });
    createEffect(() => {
        el.innerHTML = "";
        new XMindEmbedViewer({
            el,
            file: file(),
        });
    });
    return (
        <div class="flex flex-col justify-center items-center h-full w-full">
            <input
                type="file"
                oninput={async (e) => {
                    const file = await e.currentTarget.files![0].arrayBuffer();
                    mutate(file);
                }}></input>
            <div ref={el!}></div>
        </div>
    );
}
