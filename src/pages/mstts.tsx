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

import saveAs from "file-saver";

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
    const sample = { ...context, token: "" };
    const key = JSON.stringify(sample);
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
await import("@shoelace-style/shoelace/dist/components/textarea/textarea.js");
/* 渲染主要界面 */
export default function () {
    const [token, setToken] = createSignal(
        localStorage.getItem("__mstts_token__") || ""
    );
    const [sounds, setSounds] = createSignal<ContextInStore[]>([
        { text: "测试中哦", url: "" },
    ]);
    /* 更新下载所有语音 */
    const updateAll = async () => {
        const all = await Promise.all(
            sounds().map(async (i) => {
                const data = await getInfo({
                    ...i,
                    token: token(),
                });

                return data;
            })
        );
        setSounds(all);
        return all;
    };
    /* 结合所有语音 */
    const CombileAllSounds = async () => {
        const blobs = await updateAll().then((res) =>
            Promise.all(
                res.map((i) => {
                    return fetch(i.url).then((res) => res.blob());
                })
            )
        );
        saveAs(new Blob(blobs), "音频文件.mp3");
    };
    return (
        <div class="h-full w-full">
            <div class="w-full">
                <button onclick={CombileAllSounds}>下载为整个 MP3</button>
                <button
                    onclick={() => {
                        const token = prompt();
                        console.log("设置 token", token);
                        if (token) {
                            setToken(token);
                            localStorage.setItem("__mstts_token__", token);
                        }
                    }}>
                    设置token
                </button>
                <button onclick={updateAll}>更新所有语音</button>
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
