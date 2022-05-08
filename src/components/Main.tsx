import { createSignal, lazy, Suspense } from "solid-js";
import { Dynamic } from "solid-js/web";

import { Description } from "./Description";
import { ModuleDescription } from "./ModuleDescription";
import { SystemEvents } from "./System";

export default function Home() {
    const pageName = window.location.hash.replace("#", "") || "index";
    const [queryText, setText] = createSignal(pageName);
    const [description, setDescription] = createSignal({
        title: "Unknown Module",
        desc: "加载信息中。。。",
    } as ModuleDescription);

    SystemEvents.on("changePage", (page: string) => {
        setText(page);
    });
    const AsyncPage = (pagesName: string) => () => {
        const Page = lazy(() => {
            if (pagesName === "") return Promise.resolve(<div>Loading</div>);
            console.log("%c跳转到" + pagesName, "color:red");
            return import(`../pages/${pagesName}.tsx`).then((module) => {
                if ("description" in module) setDescription(module.description);
                return module;
            });
        });
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Page />
            </Suspense>
        );
    };

    return (
        <section class="flex flex-col bg-white text-gray-700 p-4 overflow-hidden h-full">
            {/* 模块解析 */}
            <Description description={description()}></Description>

            {/* 具体模块的内容 */}
            <div class="flex-grow overflow-y-auto overflow-x-hidden ">
                <Dynamic component={AsyncPage(queryText())} />
            </div>
        </section>
    );
}
