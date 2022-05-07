import { createSignal, lazy, Suspense, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

import { CodeViewer } from "./dependencePanel/CodeViewer";
import { ModuleStore } from "./dependencePanel/ModuleStore";
import { SystemEvents } from "./System";
export default function Home() {
    const pageName = window.location.hash.replace("#", "") || "index";
    const [queryText, setText] = createSignal(pageName);
    const [description, setDescription] = createSignal({
        title: "Unknown Module",
        desc: "这个模块没有命名哦",
    });

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
            <div class="rounded-lg border-2 border-orange-400">
                <h1 class="text-lg">{description().title}</h1>
                <p class="text-sm text-gray-400">{description().desc}</p>
            </div>
            <div class="flex-grow overflow-y-auto overflow-x-hidden ">
                <Dynamic component={AsyncPage(queryText())} />
            </div>
            <Show when={ModuleStore.codeViewer.show}>
                <div class="absolute w-screen h-screen top-0 left-0 flex justify-center items-center z-50">
                    <CodeViewer
                        src={ModuleStore.codeViewer.src}
                        languages={[
                            "javascript",
                            "css",
                            "tsx",
                            "typescript",
                        ]}></CodeViewer>
                </div>
            </Show>
        </section>
    );
}
