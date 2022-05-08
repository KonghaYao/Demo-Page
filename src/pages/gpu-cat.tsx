import { onMount } from "solid-js";
import { loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";
import type { GPU as _GPU } from "gpu.js";
import { imageToLocalURL } from "../utils/imageToLocalURL";
import { ModuleDescription } from "../components/ModuleDescription";
export const description: ModuleDescription = {
    title: "GPU.js —— Cat 图像扰动",
    desc: "GPU.js 可以执行图像的像素级调整！",
    link: [
        "https://www.npmjs.com/package/gpu.js",
        "https://github.com/gpujs/gpu.js",
    ],
};

await loadScript(
    "https://cdn.jsdelivr.net/npm/gpu.js@latest/dist/gpu-browser.min.js"
);
const GPU = useGlobal<typeof _GPU>("GPU");
/** 获取图像的像素点阵，只获取一次 */
function imageToArray() {
    return new Promise<[HTMLImageElement, Uint8ClampedArray]>(
        async (resolve) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d")!;
            let image = new Image();
            const url =
                "https://cdn.jsdelivr.net/gh/tensorflow/tfjs-examples/mobilenet/cat.jpg";
            const Url = await imageToLocalURL(url);
            image.src = Url;
            image.onload = () => {
                canvas.height = image.height;
                canvas.width = image.width;
                ctx.drawImage(image, 0, 0, image.width, image.height);

                resolve([
                    image,
                    ctx.getImageData(0, 0, image.width, image.height).data,
                ]);
            };
        }
    );
}

export default function () {
    onMount(async () => {
        const [image, BitArray] = await imageToArray();
        const render = new GPU({ mode: "gpu" })
            .createKernel(function (
                this: any,
                data: Uint8ClampedArray,
                wobble: any
            ) {
                let x = this.thread.x,
                    y = this.thread.y;

                //var data = this.constants.data;
                // wouldn't be fun if the kernel did _nothing_
                x = Math.floor(x + wobble * Math.sin(y / 10));
                y = Math.floor(y + wobble * Math.cos(x / 10));

                // r g b a 四个位置，所以需要乘以四才是主要的点
                var n = 4 * (x + this.constants.w * (this.constants.h - y));
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

        function callRender() {
            const wobble = 14 * Math.sin(Date.now() / 400);
            render(BitArray, wobble);

            window.requestAnimationFrame(() => {
                callRender();
            });
        }
        callRender();
    });

    let container: HTMLDivElement;
    return <div class="w-full overflow-auto" ref={container!}></div>;
}
