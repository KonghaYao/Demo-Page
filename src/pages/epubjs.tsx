import { Notify } from "notiflix";
import {
    Component,
    createEffect,
    createSignal,
    lazy,
    Suspense,
} from "solid-js";
import { Loading } from "../components/LoadingPage/loading";
import { ModuleDescription } from "../components/ModuleDescription";
import { loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";

export const description: ModuleDescription = {
    fileName: "epubjs",
    title: "epubjs 电子书查看插件",
    desc: "实现浏览器查看 epub 文件",
    link: [
        "https://github.com/futurepress/epub.js",
        "https://www.npmjs.com/package/epubjs",
    ],
};

export default function () {
    let control: any;
    const [url, setURL] = createSignal<string | ArrayBuffer>(
        "https://s3.amazonaws.com/moby-dick/moby-dick.epub"
    );

    const LazyBook = lazy(async () => {
        // 加载 jszip 这个是 epub 的额外依赖
        await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js"
        );
        // 加载 epubjs
        await loadScript(
            "https://fastly.jsdelivr.net/npm/epubjs/dist/epub.min.js"
        );

        return { default: Book };
    });

    return (
        <div class="w-full h-full flex flex-col">
            <input
                type="file"
                onchange={async (e) => {
                    const file = e.currentTarget.files![0];
                    const buffer = await file.arrayBuffer();
                    setURL(buffer);
                }}
            />
            <Suspense fallback={<Loading></Loading>}>
                <LazyBook
                    url={url()}
                    ready={(inner) => {
                        if (control) control.destroy();
                        control = inner;
                    }}></LazyBook>
            </Suspense>

            <div class="flex justify-center item-center">
                <button class="material-icons " onclick={() => control.prev()}>
                    keyboard_arrow_left
                </button>

                <button class="material-icons " onclick={() => control.next()}>
                    keyboard_arrow_right
                </button>
            </div>
        </div>
    );
}

const Book: Component<{
    url: string | ArrayBuffer;
    ready?: (control: any) => void;
}> = (props) => {
    const ePub = useGlobal<any>("ePub");
    // 构建 dom 与 epubjs 的代码绑定
    let el: HTMLDivElement;
    const rebuild = () => {
        if (!el) return;
        const book = ePub(props.url);
        const control = book.renderTo(el, {
            method: "continuous",
            width: "100%",
        });
        control.display();
        console.log(props.url);
        book.ready.then(() => {
            Notify.success("电子书下载完毕 ");
            if (props.ready) props.ready(control);
        });
        return control;
    };
    createEffect(rebuild);

    return <div ref={el!} class="w-full h-full flex-grow overflow-auto"></div>;
};
