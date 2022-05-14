import type Sodium from "libsodium-wrappers";
import { Component, createSignal, For, lazy, Suspense } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";

// 在 npm 上没有 browser 版本
// https://hat.sh/about/#technical-details
import {
    Encryption, // 加密数据
    Decryption, // 解密数据
} from "../utils/cryption";
import { timeCounter } from "../utils/timeCounter";
import { useGlobal } from "../utils/useGlobal";

/** 渲染指定的数据进行一个展示 */
export const description: ModuleDescription = {
    fileName: "CryptoFile",
    title: "Sodium 实现文件加密与解密",
    desc: "Sodium 可以实现浏览器端的加密，使用 Sodium 可以实现文件的加密与解密！",
    link: ["https://hat.sh/about/#technical-details"],
};

/** 获取全局的属性 */
const sodium = useGlobal<typeof Sodium>("sodium");
interface ImageShower {
    url: string;
    desc: string;
    title: string;
    size: number;
    time: number;
}
import "@shoelace-style/shoelace/dist/components/format-bytes/format-bytes.js";
import { Loading } from "../components/LoadingPage/loading";
/** 渲染每一个图片 */
const RenderImage: Component<{
    data: ImageShower;
}> = (props) => {
    return (
        <div className="col-span-1 flex flex-col items-center h-full">
            <div className="font-bold">{props.data.title}</div>
            <div className="text-sm text-gray-500">{props.data.desc}</div>
            <div className="flex-grow my-2">
                <img src={props.data.url}></img>
            </div>
            <div className="text-sm text-gray-500">
                {/* @ts-ignore */}
                <sl-format-bytes value={props.data.size} unit="bit" />
                <span class="px-2">花费时间 {props.data.time} ms</span>
            </div>
        </div>
    );
};

const AsyncCrypto = lazy(async () => {
    const images: ImageShower[] = [];
    const pushImage = (
        result: ArrayBuffer,
        options: Omit<ImageShower, "url" | "size">
    ) => {
        const url = URL.createObjectURL(new Blob([result]));
        images.push({ url, ...options, size: result.byteLength });
    };
    // 主要加解密功能实现
    await sodium.ready
        .then(async () => {
            timeCounter("getFile");
            const chunk = await fetch("https://source.unsplash.com/500x300", {
                cache: "force-cache",
            }).then((res) => res.arrayBuffer());
            const result = new Uint8Array(chunk);
            const time = timeCounter("getFile")!;
            pushImage(chunk, {
                title: "原始数据",
                desc: "输入的二进制数据",
                time,
            });
            return result;
        })
        .then((chunk: Uint8Array) => {
            timeCounter("encrypt")!;
            const result = Encryption("123456", new Uint8Array(chunk));
            const time = timeCounter("encrypt")!;
            pushImage(result, {
                title: "加密后的结果",
                desc: "文件头+文件（分隔符）文件（结束符号）",
                time,
            });
            return result;
        })
        .then((encryptedChunk: Uint8Array) => {
            timeCounter("decrypt")!;
            const result = Decryption("123456", encryptedChunk);
            const time = timeCounter("decrypt")!;
            pushImage(result!, {
                title: "解密后的文件",
                desc: "解密文件",
                time,
            });
        });
    return {
        default: () => {
            return (
                <For each={images}>
                    {(data) => <RenderImage data={data}></RenderImage>}
                </For>
            );
        },
    };
});
export default function CryptoFile() {
    return (
        <div className="grid  items-center space-y-3 grid-cols-3 my-4">
            <Suspense fallback={<Loading></Loading>}>
                <AsyncCrypto></AsyncCrypto>
            </Suspense>
        </div>
    );
}
