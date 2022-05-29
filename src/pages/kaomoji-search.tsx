import { KaomojiType } from "kaomoji-search";
import { createSignal, For } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import { NPM } from "../global";
export const description: ModuleDescription = {
    fileName: "kaomoji-search",
    title: "Kaomoji-search 颜文字随机库",
    desc: "Kaomoji-search 颜文字检索",
    link: ["https://www.npmjs.com/package/kaomoji-search"],
};
const { randomKaomoji, index } = (await import(
    /* @ts-ignore */
    NPM + "kaomoji-search@1.0.2/dist/index.js/+esm"
)) as typeof import("kaomoji-search");

export default function () {
    const reRandomList = (word: KaomojiType) => {
        return [...Array(60).keys()].map((i) => randomKaomoji(word));
    };
    const [randomList, setRandomList] = createSignal<string[]>(
        reRandomList("cry")
    );

    return (
        <div class="h-full">
            <select
                value="cry"
                oninput={(e) =>
                    setRandomList(
                        reRandomList(e.currentTarget.value as KaomojiType)
                    )
                }>
                <For each={index}>
                    {(name) => {
                        return <option value={name}>{name}</option>;
                    }}
                </For>
            </select>
            <div class=" w-full  z-10 overflow-hidden  bg-clip-text text-transparent bg-gradient-to-br to-blue-500 from-purple-500 flex flex-wrap justify-between">
                <For each={randomList()}>
                    {(i) => <span class="mx-4 my-2">{i}</span>}
                </For>
            </div>
        </div>
    );
}
