import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import ColorThief, { ColorHex } from "colorthief";
import { imageToLocalURL } from "../utils/imageToLocalURL";
import { filter, fromEvent, map, Subscription, tap } from "rxjs";
const colorThief = new ColorThief();
export const description = {
    title: "ColorThief 颜色抽取器",
};
const url = await imageToLocalURL(
    "https://cdn.jsdelivr.net/gh/tensorflow/tfjs-examples/mobilenet/cat.jpg"
);
export default function () {
    const [src, setSrc] = createSignal(url);
    const [Main, setMain] = createSignal([0, 0, 0] as ColorHex);
    const [ColorSets, setColorSets] = createSignal([] as ColorHex[]);
    const getColor = (e: Event) => {
        const mainColor = colorThief.getColor(
            e.currentTarget as HTMLImageElement
        );
        const Colors = colorThief.getPalette(
            e.currentTarget as HTMLImageElement
        );
        setMain(mainColor);
        setColorSets(Colors);
    };
    let file: HTMLInputElement;
    let inputFile$: Subscription;
    onMount(() => {
        inputFile$ = fromEvent(file, "input")
            .pipe(
                tap(() => URL.revokeObjectURL(src())),
                map((e: any) => e.target.files[0]),
                filter((e) => e instanceof Blob),
                map((file) => {
                    const src = URL.createObjectURL(file);
                    setSrc(src);
                })
            )
            .subscribe();
    });
    onCleanup(() => {
        inputFile$.unsubscribe();
    });
    return (
        <div>
            <div class="m-2">
                <input
                    type="file"
                    ref={file!}
                    accept="image/*"
                    style="display:none"
                />
                <img
                    class="m-auto w-full max-w-lg cursor-pointer"
                    src={src()}
                    onclick={() => file.click()}
                    onload={getColor}></img>
            </div>
            <div class="grid grid-cols-3 auto-cols-min">
                <p>主要颜色</p>
                <p class="col-span-2">颜色盘</p>
                <ColorCard color={Main()}></ColorCard>
                <div class="flex col-span-2">
                    <For each={ColorSets()}>
                        {(item) => <ColorCard color={item}></ColorCard>}
                    </For>
                </div>
            </div>
        </div>
    );
}
/** 展示一个颜色方格 */
export const ColorCard = (props: { color: number[] }) => {
    const color = createMemo(
        () =>
            `#${props.color
                .map((i) => i.toString(16))
                .join("")
                .toUpperCase()}`
    );
    const [showHex, setShowHex] = createSignal(false);
    return (
        <div
            class="h-12 w-12 text-sx flex justify-center items-center "
            onmouseenter={() => setShowHex(true)}
            onmouseleave={() => setShowHex(false)}
            style={{
                "background-color": color(),
            }}>
            <span
                class="bg-clip-text  transition-opacity "
                style={{ opacity: showHex() ? 100 : 0 }}>
                {color}
            </span>
        </div>
    );
};
