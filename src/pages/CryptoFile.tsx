import type Sodium from "libsodium-wrappers";
import { Component, createSignal, For, lazy, Suspense } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";

// 在 npm 上没有 browser 版本
// https://hat.sh/about/#technical-details
import { timeCounter } from "../utils/timeCounter";
import { useGlobal } from "../utils/useGlobal";

/** 渲染指定的数据进行一个展示 */
export const description: ModuleDescription = {
    fileName: "CryptoFile",
    title: "Sodium 实现文件加密与解密",
    desc: "Sodium 可以实现浏览器端的加密，使用 Sodium 可以实现文件的加密与解密！",
    link: ["https://hat.sh/about/#technical-details"],
};

export interface ImageShower {
    src: string;
    description: string;
    title: string;
    size: number;
    time: number;
}
await import ("@shoelace-style/shoelace/dist/components/format-bytes/format-bytes.js");
import { Loading } from "../components/LoadingPage/loading";
/** 渲染每一个图片 */
const RenderImage: Component<{
    data: ImageShower;
    onclick: () => void;
}> = (props) => {
    return (
        <div className="col-span-1 flex flex-col items-center h-full">
            <div className="font-bold">{props.data.title}</div>
            <div className="text-sm text-gray-500">
                {props.data.description}
            </div>
            <div className="flex-grow my-2">
                <img src={props.data.src} onclick={() => props.onclick()}></img>
            </div>
            <div className="text-sm text-gray-500">
                <sl-format-bytes value={props.data.size} unit="bit" />
                <span class="px-2">花费时间 {props.data.time} ms</span>
            </div>
        </div>
    );
};

import { showImage } from "../utils/showImage";
import { GH } from "../global";

export default function CryptoFile() {
    const [message, setMessage] = createSignal("加载中...");
    const AsyncCrypto = lazy(async () => {
        setMessage("加载加密函数中...");
        const {
            Encryption, // 加密数据
            Decryption, // 解密数据
        } = await import("../utils/cryption");

        /** 获取全局的属性 */
        const sodium = useGlobal<typeof Sodium>("sodium");
        const images: ImageShower[] = [];
        const pushImage = (
            result: ArrayBuffer,
            options: Omit<ImageShower, "src" | "size">
        ) => {
            const url = URL.createObjectURL(new Blob([result]));
            images.push({ src: url, ...options, size: result.byteLength });
        };
        setMessage("初始化加密插件...");
        // 主要加解密功能实现
        await sodium.ready
            .then(async () => {
                setMessage("下载图像中...");
                timeCounter("getFile");
                const chunk = await fetch(
                    GH + "tensorflow/tfjs-examples/mobilenet/cat.jpg",
                    {
                        cache: "force-cache",
                    }
                ).then((res) => res.arrayBuffer());
                const result = new Uint8Array(chunk);
                const time = timeCounter("getFile")!;
                pushImage(chunk, {
                    title: "导入原始数据",
                    description: "输入的二进制数据",
                    time,
                });
                return result;
            })
            .then((chunk: Uint8Array) => {
                setMessage("加密图像中...");
                timeCounter("encrypt")!;
                const result = Encryption("123456", new Uint8Array(chunk));
                const time = timeCounter("encrypt")!;
                pushImage(result, {
                    title: "加密过程与结果",
                    description: "文件头+文件（分隔符）文件（结束符号）",
                    time,
                });
                return result;
            })
            .then((encryptedChunk: Uint8Array) => {
                setMessage("解密图像中...");
                timeCounter("decrypt")!;
                const result = Decryption("123456", encryptedChunk);
                const time = timeCounter("decrypt")!;
                pushImage(result!, {
                    title: "解密文件过程",
                    description: "解密文件",
                    time,
                });
            });

        return {
            default: () => {
                return (
                    <For each={images}>
                        {(data, index) => (
                            <RenderImage
                                onclick={() => showImage(images, index())}
                                data={data}></RenderImage>
                        )}
                    </For>
                );
            },
        };
    });

    return (
        <Suspense fallback={<Loading message={message()}></Loading>}>
            <div className="grid gap-2 items-center space-y-3 grid-cols-3 my-4">
                <AsyncCrypto></AsyncCrypto>
            </div>
        </Suspense>
    );
}
