import type Sodium from "libsodium-wrappers";
import { createSignal, For } from "solid-js";
// 在 npm 上没有 browser 版本
// https://hat.sh/about/#technical-details
import {
    Encryption, // 加密数据
    Decryption, // 解密数据
} from "../utils/cryption";
const sodium: typeof Sodium = (globalThis as any).sodium;

interface ImageShower {
    url: string;
    desc: string;
    title: string;
    size: number;
}
const renderImage = (shower: ImageShower) => {
    return (
        <div class="col-span-1 flex flex-col items-center h-full">
            <div class="font-bold">{shower.title}</div>
            <div class="text-sm text-gray-500">{shower.desc}</div>
            <div class="flex-grow my-2">
                <img src={shower.url}></img>
            </div>
            <div class="text-sm text-gray-500">{shower.size} Bytes</div>
        </div>
    );
};

export default function CryptoFile() {
    const [images, setImages] = createSignal<ImageShower[]>([]);
    const refreshImages = (
        result: ArrayBuffer,
        options: Omit<ImageShower, "url" | "size">
    ) => {
        const url = URL.createObjectURL(new Blob([result]));
        setImages([...images(), { url, ...options, size: result.byteLength }]);
    };
    sodium.ready
        .then(async () => {
            const chunk = await fetch("https://source.unsplash.com/500x300", {
                cache: "force-cache",
            }).then((res) => res.arrayBuffer());
            const result = new Uint8Array(chunk);
            refreshImages(chunk, {
                title: "原始数据",
                desc: "输入的二进制数据",
            });
            return result;
        })
        .then((chunk: Uint8Array) => {
            const result = Encryption("123456", new Uint8Array(chunk));
            refreshImages(result, {
                title: "加密后的结果",
                desc: "文件头+文件（分隔符）文件（结束符号）",
            });
            return result;
        })
        .then((encryptedChunk: Uint8Array) => {
            const result = Decryption("123456", encryptedChunk);
            refreshImages(result!, {
                title: "解密后的文件",
                desc: "解密文件",
            });
        });

    return (
        <div class="grid  items-center space-y-3 grid-cols-3 my-4">
            <For each={images()}>{renderImage}</For>
        </div>
    );
}
