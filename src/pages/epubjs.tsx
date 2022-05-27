import { Notify } from "notiflix";
import { lazy, onCleanup, Suspense } from "solid-js";
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
    const Book = lazy(async () => {
        // 加载 jszip 这个是 epub 的额外依赖
        await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js"
        );
        // 加载 epubjs
        await loadScript(
            "https://fastly.jsdelivr.net/npm/epubjs/dist/epub.min.js"
        );
        const ePub = useGlobal<any>("ePub");

        // 构建 dom 与 epubjs 的代码绑定
        const el = (
            <div id="area" class="w-full h-full flex-grow overflow-auto"></div>
        );
        const book = ePub("https://s3.amazonaws.com/moby-dick/moby-dick.epub");
        control = book.renderTo(el, {
            method: "continuous",
            width: "100%",
            flow: "auto",
        });
        control.display();
        await book.ready.then(() => {
            Notify.success("电子书下载完毕");
        });
        console.log(control);
        return { default: () => el };
    });

    onCleanup(() => {
        control.destroy();
    });
    return (
        <div class="w-full h-full flex flex-col">
            <Suspense fallback={<Loading></Loading>}>
                <Book></Book>
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
