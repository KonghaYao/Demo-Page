import { Component, createSignal, For } from "solid-js";
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
import { escapeString } from "types:assemblyscript/src/util";
type SendContext = {
    token: string;
    voice?: string;
    express?: string;
    role?: string;
    rate?: number;
    pitch?: number;
    text: string;
};
type ContextInStore = Omit<SendContext & { url: string }, "token">;

const InfoCache = new Map<string, ContextInStore>();
const getInfo = async (context: SendContext) => {
    const key = JSON.stringify(context);
    if (InfoCache.has(key)) return InfoCache.get(key)!;
    const { text, token, voice, express, role, rate, pitch } = context;

    const blob = await getTTSData(
        text,
        token,
        voice,
        express,
        role,
        rate,
        pitch
    );
    const result = Object.assign(context, {
        url: URL.createObjectURL(
            new File([blob], "index.mp3", { type: "audio/x-mpeg" })
        ),
    });
    InfoCache.set(key, result);
    return result;
};
import { saveAs } from "file-saver";
await import("@shoelace-style/shoelace/dist/components/textarea/textarea.js");
/* 渲染主要界面 */
export default function () {
    const [token, setToken] = createSignal("");
    const [sounds, setSounds] = createSignal<ContextInStore[]>([
        { text: "测试中哦", url: "" },
    ]);
    const CombileAllSounds = async () => {
        const blobs = await Promise.all(
            sounds().map((i) => {
                return fetch(i.url).then((res) => res.blob());
            })
        );
        saveAs(new Blob(blobs));
    };
    return (
        <div class="h-full w-full">
            <div class="w-full">
                <button onclick={CombileAllSounds}>下载为整个 MP3</button>
                <button
                    onclick={() => {
                        const token = prompt();
                        setToken(token);
                    }}>
                    设置token
                </button>
            </div>
            <For each={sounds()}>
                {(i, index) => {
                    return (
                        <AudioCell
                            data={i}
                            index={index()}
                            onaddBefore={() => {
                                const newSounds = [...sounds()];
                                newSounds.splice(index(), 0, createNewCell());
                                console.log(newSounds, index());
                                setSounds(newSounds);
                            }}
                            onadd={() => {
                                const newSounds = [...sounds()];
                                newSounds.splice(
                                    index() + 1,
                                    0,
                                    createNewCell()
                                );
                                console.log(newSounds, index());
                                setSounds(newSounds);
                            }}
                            onclose={() => {
                                const newSounds = [...sounds()];
                                newSounds.splice(index(), 1);
                                console.log(newSounds, index());
                                setSounds(newSounds);
                            }}
                            getAudio={async (text: string) => {
                                const data = await getInfo({
                                    ...i,
                                    token: token(),
                                    text,
                                }).catch((e) => {
                                    console.log(e);
                                    Notify.failure(
                                        "下载语言异常: " + "更换 token 试一试"
                                    );
                                    return null;
                                });
                                if (data) {
                                    const newSounds = [...sounds()];
                                    newSounds.splice(index(), 1, data);
                                    setSounds(newSounds);
                                }
                            }}></AudioCell>
                    );
                }}
            </For>
            <div
                class="material-icons w-full my-4 flex text-center justify-center items-center text-xl text-green-400"
                onclick={() => {
                    const newSounds = [...sounds(), createNewCell()];
                    setSounds(newSounds);
                }}>
                <span>add</span>
            </div>
        </div>
    );
}
const createNewCell = () => {
    return { text: "", url: "" };
};
const AudioCell: Component<{
    data: ContextInStore;
    index: number;
    onclose: Function;
    onadd: Function;
    onaddBefore: Function;
    getAudio: Function;
}> = (props) => {
    const i = props.data;
    let text = i.text;
    return (
        <div class="flex">
            <div class="flex flex-col items-center justify-around">
                <span class="material-icons" onclick={props.onaddBefore as any}>
                    add
                </span>
                <span class="material-icons " onclick={props.onclose as any}>
                    close
                </span>
                <span class="material-icons" onclick={props.onadd as any}>
                    add
                </span>
            </div>
            <sl-textarea
                class="flex-grow"
                placeholder="Type something"
                value={i.text}
                oninput={(e: any) => {
                    text = e.target.value;
                }}></sl-textarea>
            <div class="flex flex-col items-center">
                <button onclick={() => props.getAudio(text)}>
                    重新获取音频
                </button>
                <audio controls src={i.url}></audio>
            </div>
        </div>
    );
};
