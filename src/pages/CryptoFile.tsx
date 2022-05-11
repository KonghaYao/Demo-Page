import type Sodium from "libsodium-wrappers";
import { createSignal, For } from "solid-js";
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
const renderImage = (shower: ImageShower) => {
    return (
        <div className="col-span-1 flex flex-col items-center h-full">
            <div className="font-bold">{shower.title}</div>
            <div className="text-sm text-gray-500">{shower.desc}</div>
            <div className="flex-grow my-2">
                <img src={shower.url}></img>
            </div>
            <div className="text-sm text-gray-500">
                {shower.size} Bytes 花费时间 {shower.time} ms
            </div>
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

    // 主要加解密功能实现
    sodium.ready
        .then(async () => {
            timeCounter("getFile");
            const chunk = await fetch("https://source.unsplash.com/500x300", {
                cache: "force-cache",
            }).then((res) => res.arrayBuffer());
            const result = new Uint8Array(chunk);
            const time = timeCounter("getFile")!;
            refreshImages(chunk, {
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
            refreshImages(result, {
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
            refreshImages(result!, {
                title: "解密后的文件",
                desc: "解密文件",
                time,
            });
        });

    return (
        <div className="grid  items-center space-y-3 grid-cols-3 my-4">
            <For each={images()}>{renderImage}</For>
        </div>
    );
}
