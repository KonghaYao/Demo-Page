import { createSignal, For } from "solid-js";
// 在 npm 上没有 browser 版本
// https://hat.sh/about/#technical-details
import {
    Encryption, // 加密数据
    Decryption, // 解密数据
} from "../utils/cryption";
const sodium = (globalThis as any).sodium;

const renderImage = ({ url }: { url: string }) => {
    return (
        <div>
            <img class="col-span-1" src={url}></img>
        </div>
    );
};

export default function CryptoFile() {
    const [images, setImages] = createSignal<
        {
            url: string;
        }[]
    >([]);
    const refreshImages = (result: ArrayBuffer) => {
        const url = URL.createObjectURL(new Blob([result]));
        setImages([...images(), { url }]);
    };
    sodium.ready
        .then(async () => {
            const chunk = await fetch("https://source.unsplash.com/500x300", {
                cache: "force-cache",
            }).then((res) => res.arrayBuffer());
            console.log("原始数据=>", new Uint8Array(chunk));
            refreshImages(chunk);
            const result = Encryption("123456", new Uint8Array(chunk));
            refreshImages(result);
            console.log("加密结果=>", result);
            return result;
        })
        .then((encryptedChunk: Uint8Array) => {
            const result = Decryption("123456", encryptedChunk);
            console.log("解密结果=>", result);
            refreshImages(result!);
        });

    return (
        <div class="grid  items-center space-y-3 grid-cols-3">
            <For each={images()}>{renderImage}</For>
        </div>
    );
}
