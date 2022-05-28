import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import ColorThief, { ColorHex } from "colorthief";
import { imageToLocalURL } from "../utils/imageToLocalURL";
import { filter, fromEvent, map, Subscription, tap } from "rxjs";
import { ModuleDescription } from "../components/ModuleDescription";

export const description: ModuleDescription = {
    fileName: "color-thief",
    title: "ColorThief 颜色抽取器",
    link: [
        "https://lokeshdhakar.com/projects/color-thief/",
        "https://github.com/lokesh/color-thief",
    ],
    desc: "Color Thief 可以提取一个图片中的主体颜色，或者直接抽取出一个颜色模板。",
};

/**
 * 因为网络上的图片触发 跨域错误，但是没有触发 CORS 协议，
 * 那么可以直接下载并转化为本地 URL
 */
const url = await imageToLocalURL(
    GH + "tensorflow/tfjs-examples/mobilenet/cat.jpg"
);

/** 主体 */
export default function () {
    const colorThief = new ColorThief();
    const [src, setSrc] = createSignal(url);
    const [Main, setMain] = createSignal([0, 0, 0] as ColorHex);
    const [ColorSets, setColorSets] = createSignal([] as ColorHex[]);

    /** 当图片加载完成，直接获取颜色  */
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
    /** 绑定上传事件 */
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
            <div className="m-2">
                {/* 隐藏的上传元素 */}
                <input
                    type="file"
                    ref={file!}
                    accept="image/*"
                    style="display:none"
                />
                {/* 图片展示 */}
                <img
                    className="m-auto w-full max-w-lg cursor-pointer"
                    src={src()}
                    onclick={() => file.click()}
                    onload={getColor}></img>
            </div>
            <div className="flex">
                <div>
                    <p class="col-span-1">主要颜色</p>
                    <ColorCard class="col-span-1" color={Main()}></ColorCard>
                </div>
                <div class="ml-4">
                    <p>颜色盘</p>

                    <div className="flex">
                        <For each={ColorSets()}>
                            {(item) => <ColorCard color={item}></ColorCard>}
                        </For>
                    </div>
                </div>
            </div>
        </div>
    );
}

import copy from "copy-to-clipboard";
import { Notify } from "notiflix";
import { GH } from "../global";
/** 展示一个颜色方格 */
export const ColorCard = (props: { color: number[]; class?: string }) => {
    const color = createMemo(
        () =>
            `#${props.color
                .map((i) => i.toString(16))
                .join("")
                .toUpperCase()}`
    );
    const textColor = ([r, g, b]: number[]) =>
        r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000" : "#FFF";
    return (
        <div
            class={props.class}
            className="h-16 w-16 text-sx flex justify-center items-center "
            style={{
                "background-color": color(),
            }}
            onclick={() => {
                Notify.success("复制成功");
                copy(color());
            }}>
            <span
                className="text-xs cursor-pointer"
                style={{ color: textColor(props.color) }}>
                {color()}
            </span>
        </div>
    );
};
