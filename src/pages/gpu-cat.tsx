import { onCleanup, onMount } from "solid-js";
import { loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";
import type { GPU as _GPU } from "gpu.js";
import type { ModuleDescription } from "../components/ModuleDescription";
import { imageToArray } from "../utils/imageToArray";
import { animationFrames, map, Subscription } from "rxjs";
import { GH, NPM } from "../global";

export const description: ModuleDescription = {
    fileName: "gpu-cat",
    title: "GPU.js —— Cat 图像扰动",
    desc: "GPU.js 可以执行图像的像素级调整！",
    link: [
        "https://www.npmjs.com/package/gpu.js",
        "https://github.com/gpujs/gpu.js",
    ],
};

/* 下载图片并转化为 像素二进制数组 */

export default function () {
    let update$: Subscription;
    onMount(async () => {
        await loadScript(NPM + "gpu.js@latest/dist/gpu-browser.min.js");
        const GPU = useGlobal<typeof _GPU>("GPU");
        const [image, BitArray] = await imageToArray(
            GH + "tensorflow/tfjs-examples/mobilenet/cat.jpg"
        );
        const render = new GPU({ mode: "gpu" })
            .createKernel(function (
                this: any,
                data: Uint8ClampedArray,
                wobble: any
            ) {
                let x = this.thread.x,
                    y = this.thread.y;

                x = Math.floor(x + wobble * Math.sin(y / 10));
                y = Math.floor(y + wobble * Math.cos(x / 10));

                // r g b a 四个位置，所以需要乘以四才是主要的点
                let n = 4 * (x + this.constants.w * (this.constants.h - y));
                this.color(
                    data[n] / 256,
                    data[n + 1] / 256,
                    data[n + 2] / 256,
                    1
                );
            })
            .setConstants({ w: image.width, h: image.height })
            .setOutput([image.width, image.height])
            .setGraphical(true);

        container.appendChild(render.canvas);
        render.canvas.style.width = "100%";

        /** 创建循环 */
        update$ = animationFrames()
            .pipe(
                map(() => {
                    /** 数据扰动值 */
                    const wobble = 14 * Math.sin(Date.now() / 400);
                    return wobble;
                }),
                map((wobble) => {
                    /** 渲染数据 */
                    render(BitArray, wobble);
                })
            )
            .subscribe();
    });

    onCleanup(() => {
        update$?.unsubscribe();
    });
    let container: HTMLDivElement;
    return <div className="w-3/4 overflow-auto" ref={container!}></div>;
}
