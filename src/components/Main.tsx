import { createSignal, ErrorBoundary, lazy, Suspense } from "solid-js";
import { Dynamic } from "solid-js/web";
import { CDN } from "../global";

import { Description } from "./Description";
import { ErrorPage } from "./LoadingPage/ErrorPage";
import { Loading } from "./LoadingPage/loading";
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
        const Page = lazy(async () => {
            if (pagesName === "") return Promise.resolve(<div>Loading</div>);
            console.log("%c跳转到" + pagesName, "color:red");
            const module = new URL(`./src/pages/${pagesName}.tsx`, CDN);


            return import(module.toString()).then((module) => {
                if ("description" in module) setDescription(module.description);
                return module;
            })

        });
        return (
            <Suspense fallback={<Loading></Loading>}>
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
                <ErrorBoundary fallback={(err, reload) => <ErrorPage err={err} reload={reload}></ErrorPage>}>

                    <Dynamic component={AsyncPage(queryText())} />
                </ErrorBoundary>
            </div>
        </section>
    );
}
