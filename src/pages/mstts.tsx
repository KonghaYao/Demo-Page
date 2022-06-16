import { Component, createEffect, createSignal, For, onMount } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";

import { Notify } from "notiflix";
await loadLink(NPM + "aplayer/dist/APlayer.min.css");

export const description: ModuleDescription = {
    fileName: "mstts",
    title: "微软 TTS ",
    desc: "微软提供了 TTS 转为语音的服务，这是它的一个例子",
    link: [
        "https://azure.microsoft.com/en-gb/services/cognitive-services/text-to-speech/#features",
    ],
};
import { getTTSData, voices } from "../utils/mstts-js";
import { loadLink } from "../utils/loadScript";
import { NPM } from "../global";

import saveAs from "file-saver";
import localforage from "localforage";
const store = await localforage.createInstance({
    name: "__mstts__",
    driver: [localforage.INDEXEDDB],
});
await store.ready();

await Promise.all([
    import("@shoelace-style/shoelace/dist/components/textarea/textarea.js"),
    import("@shoelace-style/shoelace/dist/components/range/range.js"),
]);

type SendContext = {
    token: string;
    voice?: string;
    express?: string;
    role?: string;
    rate: number;
    pitch: number;
    text: string;
};
type ContextInStore = Omit<SendContext & { url: string }, "token">;

const createKey = (context: any) => {
    const sample = { ...context, token: "", url: "" };
    return JSON.stringify(sample);
};

const InfoCache = new Map<string, ContextInStore>();
const getInfo = async (context: SendContext) => {
    const key = createKey(context);
    if (InfoCache.has(key)) return InfoCache.get(key)!;
    const { text, token, voice, express, role, rate, pitch } = context;
    Notify.info("正在下载中");
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
    store.setItem(key, blob);
    Notify.success("音频返回");
    return result;
};

/* 渲染主要界面 */
export default function () {
    const [token, setToken] = createSignal(
        localStorage.getItem("__mstts_token__") || ""
    );
    const [sounds, setSounds] = createSignal<ContextInStore[]>([
        { ...createNewCell(), text: "测试中哦", url: "" },
    ]);
    createEffect(() => {
        if (sounds().length) {
            store.setItem("__sounds__", sounds());
        }
    });
    const loadFromStore = async () => {
        const oldSound = await store.getItem<ContextInStore[]>("__sounds__");
        if (oldSound) {
            await Promise.all(
                oldSound.map(async (i) => {
                    const key = createKey(i);
                    const blob = await store.getItem<Blob>(key);
                    if (blob) i.url = URL.createObjectURL(blob);
                    return i;
                })
            );
            setSounds(oldSound);
            console.log("从缓存中获取数据");
        }
    };
    onMount(() => {
        loadFromStore();
    });
    /* 更新下载所有语音 */
    const updateAll = async () => {
        const all = await sounds().reduce(async (col, i) => {
            return col.then(async (arr) => {
                const data = await getInfo({
                    ...i,
                    token: token(),
                });
                arr.push(data);
                return arr;
            });
        }, Promise.resolve([] as ContextInStore[]));
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
        <div class="h-full w-full flex-grow overflow-hidden flex flex-col">
            <div class="w-full flex justify-between">
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
                    设置 token
                </button>
                <button
                    onclick={() =>
                        updateAll().catch(() => {
                            Notify.failure("请更换 token");
                        })
                    }>
                    更新所有语音
                </button>
                <button
                    onclick={() => {
                        const info = confirm("是否清空缓存");
                        if (info) {
                            store.clear();
                        }
                    }}>
                    删除所有数据缓存
                </button>
            </div>
            <div class="text-gray-400 text-xs">
                这个页面使用了微软的 tts 技术进行文本转语音的操作，需要官方的
                token 来进行启动
            </div>
            <div class="h-full flex-grow flex flex-col overflow-auto my-2">
                <For each={sounds()}>
                    {(i, index) => {
                        return (
                            <AudioCell
                                data={i}
                                index={index()}
                                onaddBefore={() => {
                                    const newSounds = [...sounds()];
                                    newSounds.splice(
                                        index(),
                                        0,
                                        createNewCell()
                                    );
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
                                    setSounds(newSounds);
                                }}
                                moveDown={() => {
                                    const newSounds = [...sounds()];
                                    const self = newSounds.splice(index(), 1);
                                    newSounds.splice(index() + 1, 0, self[0]);
                                    setSounds(newSounds);
                                }}
                                moveUp={() => {
                                    const newSounds = [...sounds()];
                                    const self = newSounds.splice(index(), 1);
                                    if (index() !== 0) {
                                        newSounds.splice(
                                            index() - 1,
                                            0,
                                            self[0]
                                        );
                                        setSounds(newSounds);
                                    }
                                }}
                                onclose={() => {
                                    const newSounds = [...sounds()];
                                    newSounds.splice(index(), 1);
                                    setSounds(newSounds);
                                }}
                                onupdate={(context) => {
                                    const newSounds = [...sounds()];
                                    newSounds.splice(index(), 1, {
                                        ...i,
                                        ...context,
                                    });
                                    setSounds(newSounds);
                                }}
                                getAudio={async () => {
                                    const data = await getInfo({
                                        ...i,
                                        token: token(),
                                    }).catch((e) => {
                                        console.log(e);
                                        Notify.failure(
                                            "下载语言异常: " +
                                                "更换 token 试一试"
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
        </div>
    );
}
const createNewCell = () => {
    return { text: "", url: "", rate: 1, pitch: 0 };
};
const AudioCell: Component<{
    data: ContextInStore;
    index: number;
    onclose: Function;
    onadd: Function;
    onaddBefore: Function;
    getAudio: Function;
    moveUp: Function;
    moveDown: Function;
    onupdate: (context: Partial<ContextInStore>) => void;
}> = (props) => {
    const i = props.data;
    return (
        <div class="flex">
            <div class="flex flex-col items-center justify-around cursor-pointer">
                <span class="material-icons" onclick={props.moveUp as any}>
                    north
                </span>
                <span class="material-icons " onclick={props.moveDown as any}>
                    south
                </span>
            </div>
            <div class="flex flex-col items-center justify-around">
                <span class="material-icons" onclick={props.onaddBefore as any}>
                    add
                </span>
                <span
                    class="material-icons bg-red-400 text-white"
                    onclick={props.onclose as any}>
                    close
                </span>
                <span class="material-icons" onclick={props.onadd as any}>
                    add
                </span>
            </div>
            <Speaker
                speaker={i.voice}
                onchange={(speaker) => {
                    props.onupdate({ voice: speaker });
                }}></Speaker>
            <sl-textarea
                class="flex-grow m-2"
                placeholder="Type something"
                value={i.text}
                on:sl-change={(e: any) => {
                    props.onupdate({ text: e.target.value });
                }}></sl-textarea>
            <div class="flex flex-col items-center">
                <button onclick={() => props.getAudio()}>重新获取音频</button>
                <div class="flex justify-between">
                    <span>语速</span>
                    <sl-range
                        type="range"
                        min="0"
                        max="3"
                        value={i.rate}
                        step="0.01"
                        on:sl-blur={(e: any) => {
                            props.onupdate({
                                rate: e.target.value,
                            });
                        }}></sl-range>
                </div>

                <div class="flex justify-between">
                    <span>语速</span>

                    <sl-range
                        type="range"
                        min="0"
                        max="2"
                        value={i.pitch}
                        on:sl-blur={(e: any) => {
                            props.onupdate({
                                pitch: e.target.value,
                            });
                        }}
                        step="0.01"></sl-range>
                </div>
                <audio controls src={i.url}></audio>
            </div>
        </div>
    );
};
const Speaker: Component<{
    speaker?: string;
    onchange: (speaker: string) => void;
}> = (props) => {
    return (
        <select
            value={props.speaker || "CN-Yunxi"}
            onchange={(e) => {
                props.onchange((e.target as HTMLSelectElement).value);
            }}>
            <For each={voices}>
                {([key, value]) => {
                    return <option value={value}>{key}</option>;
                }}
            </For>
        </select>
    );
};
