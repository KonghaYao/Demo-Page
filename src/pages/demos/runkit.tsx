import { createSignal, lazy, Show, Suspense } from "solid-js";
import { Loading } from "../components/LoadingPage/loading";
import { ModuleDescription } from "../components/ModuleDescription";
import { loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";

export const description: ModuleDescription = {
    fileName: "runkit",
    title: "RunKit —— Nodejs 运行器",
    desc: "RunKit 是 NPM 官方推荐的在线 Nodejs 运行器！",
    link: ["https://runkit.com/home"],
};

export default function () {
    const [message, setMsg] = createSignal("加载中");
    const [loading, setLoading] = createSignal(true);
    const NoteBook = lazy(async () => {
        setMsg("加载 Runkit 中。。。");
        /** 加载 Runkit 脚本 */
        await loadScript("https://embed.runkit.com");
        const RunKit = useGlobal<any>("RunKit");
        const div = <div></div>;
        RunKit.createNotebook({
            // runkit 的 父级元素
            element: div,
            // runkit 中的预设源代码
            source: '// GeoJSON!\nvar getJSON = require("async-get-json");\n\nawait getJSON("https://storage.googleapis.com/maps-devrel/google.json");',
            onLoad() {
                console.log("runkit 加载完成");
                setLoading(false);
            },
        });
        return { default: () => div };
    });

    return (
        <Suspense fallback={<Loading message={message()}></Loading>}>
            {/* NoteBook 需要加载到 dom 树上才能够进行操作，所以只能设置两个加载项 */}
            <Show when={loading()}>
                <Loading message={message()}></Loading>
            </Show>
            <NoteBook />
        </Suspense>
    );
}
