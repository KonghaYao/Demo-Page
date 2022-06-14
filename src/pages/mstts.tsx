import {
    createEffect,
    createMemo,
    createResource,
    createSignal,
    For,
    onMount,
} from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";

import { Notify } from "notiflix";
await loadLink(NPM + "aplayer/dist/APlayer.min.css");

export const description: ModuleDescription = {
    fileName: "assemblyscript",
    title: "AssemblyScript",
    desc: "AssemblyScript 是 Typescript-like 的 WebAssembly 编写语言",
    link: [
        "https://www.assemblyscript.org/",
        "https://www.npmjs.com/package/assemblyscript",
        "https://github.com/AssemblyScript/assemblyscript",
    ],
};
import { getTTSData } from "../utils/mstts-js";
import { loadLink } from "../utils/loadScript";
import { NPM } from "../global";

const getInfo = async (text: string, token: string) => {
    const blob = await getTTSData(text, token);
    return {
        text: "  fefe",
        url: URL.createObjectURL(
            new File([blob], "index.mp3", { type: "audio/x-mpeg" })
        ),
    };
};
await import("@shoelace-style/shoelace/dist/components/textarea/textarea.js");
/* 渲染主要界面 */
export default function () {
    const [info] = createResource(async () => {});
    let container: HTMLDivElement;
    const [sounds, setSounds] = createSignal<{ text: string; url: string }[]>(
        []
    );

    return (
        <div class="h-full w-full">
            <div ref={container!}></div>
            <For each={sounds()}>
                {(i) => (
                    <div class="flex">
                        <div class="material-icons ">close</div>
                        <div class="material-icons ">add</div>
                        <div>{i.text}</div>
                        <audio controls src={i.url}></audio>
                    </div>
                )}
            </For>
            <div class="material-icons w-full my-4 flex text-center justify-center items-center text-xl text-green-400">
                <span>add</span>
            </div>
        </div>
    );
}
