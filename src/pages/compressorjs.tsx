import { createResource, createSignal, Show } from "solid-js";
import { Loading } from "../components/LoadingPage/loading";
import { ModuleDescription } from "../components/ModuleDescription";

export const description: ModuleDescription = {
    fileName: "compressorjs",
    title: "Compressorjs —— 图片压缩插件",
    desc: "Compressorjs 是前端压缩图片的一个插件",
    link: ["https://github.com/fengyuanchen/compressorjs"],
};
type PicDetail = {
    title: string;
    url: string;
    size: number;
    quality: number;
};
import Compressor from "compressorjs";

/** 压缩图片代码 */
const compress = (file: File, quality: number) => {
    return new Promise<{ old: PicDetail; new: PicDetail }>((resolve) => {
        new Compressor(file, {
            quality,
            success(result) {
                const [oldOne, newOne] = [file, result].map((i) => ({
                    url: URL.createObjectURL(i),
                    size: i.size,
                }));

                resolve({
                    old: {
                        title: "原始图片",
                        ...oldOne,
                        quality: 100,
                    },
                    new: {
                        title: "压缩后图片",
                        ...newOne,
                        quality: (result.size * 100) / file.size,
                    },
                });
            },
        });
    });
};

import "@shoelace-style/shoelace/dist/components/image-comparer/image-comparer.js";
import "@shoelace-style/shoelace/dist/components/format-bytes/format-bytes.js";
export default function () {
    const [url, setURL] = createSignal(
        // 必须使用高清图片才能看得明显的差距
        "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"
    );
    const [quality, setQuality] = createSignal(0.7);
    const [files, { mutate, refetch }] = createResource(async () => {
        return fetch(url())
            .then((res) => res.blob())
            .then((res) => {
                return new File([res], "1.jpg", {
                    type: "image/jpeg",
                });
            })
            .then((file) => compress(file, quality()));
    });
    return (
        <>
            <div class="flex ">
                <input
                    type="file"
                    oninput={(e) => {
                        const file = e.currentTarget.files![0];
                        if (url()) URL.revokeObjectURL(url());
                        const Url = URL.createObjectURL(file);
                        setURL(Url);
                        refetch();
                    }}></input>
                <input
                    type="range"
                    value={70}
                    min={1}
                    max={100}
                    onchange={(e) => {
                        const Quality = e.currentTarget.value;
                        setQuality(parseInt(Quality) / 100);
                        refetch();
                    }}
                />
            </div>
            <Show when={!files.loading} fallback={<Loading></Loading>}>
                <div class="relative">
                    <sl-image-comparer>
                        {/* 右侧为 before，左侧为 after */}
                        <img slot="before" src={files()!.new.url} />
                        <img slot="after" src={files()!.old.url} />
                    </sl-image-comparer>
                    <div
                        class="absolute h-full w-full top-0 left-0 z-40 "
                        style="pointer-events:none">
                        <Detail
                            className="absolute top-4 left-4"
                            data={files()!.old}></Detail>
                        <Detail
                            className="absolute top-4 right-4 text-right"
                            data={files()!.new}></Detail>
                    </div>
                </div>
            </Show>
        </>
    );
}

const Detail = (props: { className?: string; data: PicDetail }) => {
    return (
        <div class={props.className} className="backdrop-blur-xl bg-white/70">
            <div>{props.data.title}</div>

            <sl-format-bytes value={props.data.size}></sl-format-bytes>

            <div>{props.data.quality.toFixed(2)} %</div>
        </div>
    );
};
