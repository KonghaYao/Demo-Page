import { batch, createResource, createSignal, Show } from "solid-js";
import { Loading } from "../components/LoadingPage/loading";
import { ModuleDescription } from "../components/ModuleDescription";

export const description: ModuleDescription = {
    title: "Compressorjs —— 图片压缩插件",
    desc: "Compressorjs 是前端压缩图片的一个插件",
    link: ["https://github.com/fengyuanchen/compressorjs"],
};
const MoveLine = (prop: {
    offset: number;
    width?: number;
    onDrag: (offset: number) => void;
}) => {
    const [dragging, setDragging] = createSignal(false);
    const [init, setInit] = createSignal(0);
    const cancel = () => {
        setDragging(false);
    };
    document.addEventListener("pointercancel", cancel);
    document.addEventListener("pointerup", cancel);
    return (
        <div
            class="absolute top-0 flex justify-center w-8 cursor-pointer h-full  z-40"
            style={{
                left: prop.offset + "px",
            }}
            onpointerdown={(e) => {
                batch(() => {
                    setInit(e.offsetX);
                    setDragging(true);
                });
            }}
            onpointermove={(e) => {
                if (dragging()) {
                    const diff = e.offsetX - init();
                    prop.onDrag(prop.offset + diff);
                }
            }}>
            <div class="w-1 bg-white h-full"> </div>
        </div>
    );
};

type PicDetail = {
    title: string;
    url: string;
    size: number;
    quality: number;
};
import Compressor from "compressorjs";
/** 压缩图片代码 */
const compress = (file: File) => {
    return new Promise<{ old: PicDetail; new: PicDetail }>((resolve) => {
        new Compressor(file, {
            quality: 0.6,
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

export default function () {
    const [files, { mutate, refetch }] = createResource(async () => {
        return fetch("https://source.unsplash.com/random/800x400")
            .then((res) => res.blob())
            .then((res) => {
                return new File([res], "1.jpg", {
                    type: "image/jpeg",
                });
            })
            .then(compress);
    });
    const imageStyle = {
        width: "800px",
        height: "400px",
        "max-width": "800px",
    };
    const [offset, setPercent] = createSignal(200);
    return (
        <Show when={!files.loading} fallback={<Loading></Loading>}>
            <div className="relative h-full w-full">
                <div class="h-full w-full"></div>
                <div class="h-full w-full absolute top-0 left-0 z-10 overflow-hidden">
                    <img
                        draggable={false}
                        style={imageStyle}
                        src={files()!.new.url}
                        alt=""
                    />
                </div>
                <div class="h-full w-1/2 absolute top-0 left-0 z-20 overflow-hidden">
                    <img
                        draggable={false}
                        src={files()!.old.url}
                        style={imageStyle}
                    />
                </div>

                <div class="absolute h-full w-full top-0 left-0 z-50">
                    <Detail
                        className="absolute top-0 left-0"
                        data={files()!.old}></Detail>
                    <MoveLine offset={offset()} onDrag={setPercent}></MoveLine>
                    <Detail
                        className="absolute top-0 right-0"
                        data={files()!.new}></Detail>
                </div>
            </div>
        </Show>
    );
}

const Detail = (props: { className?: string; data: PicDetail }) => {
    return (
        <div class={props.className} className="backdrop-blur-xl bg-white/70">
            <div>{props.data.title}</div>
            <div>{props.data.size} B</div>
            <div>{props.data.quality.toFixed(2)} %</div>
        </div>
    );
};
