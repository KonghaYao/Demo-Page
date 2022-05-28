import { Match } from "navigo";
import {
    Component,
    createSignal,
    ErrorBoundary,
    lazy,
    onCleanup,
    onMount,
    Suspense,
} from "solid-js";
import { CDN } from "../global";
import { Route } from "../router/index";

import { Description } from "./Description";
import { ErrorPage } from "./LoadingPage/ErrorPage";
import { Loading } from "./LoadingPage/loading";
import { ModuleDescription } from "./ModuleDescription";
export const PageViewer: Component<{ match: Match }> = (props) => {
    const [message, setMessage] = createSignal("打包中...");

    const [description, setDescription] = createSignal({
        title: "Unknown Module",
        desc: "加载信息中。。。",
    } as ModuleDescription);

    const AsyncPage: Component<{ match: Match }> = (props) => {
        if (!props.match?.data) console.error("错误:", props.match);
        const pageName = props.match.data!.pageName;
        console.group(pageName);
        const Page = lazy(async () => {
            console.log("%c跳转到" + pageName, "color:red");
            const module = new URL(`./src/pages/${pageName}.tsx`, CDN);
            return import(module.toString()).then((module) => {
                setMessage(pageName + " 页面下载完成");
                if ("description" in module) setDescription(module.description);
                return module;
            });
        });
        onMount(() => {
            setMessage("界面构建完成");
        });
        onCleanup(() => {
            console.groupEnd();
        });
        return (
            <Suspense fallback={<Loading message={message()}></Loading>}>
                <Page></Page>
            </Suspense>
        );
    };
    return (
        <section className="rounded-xl relative flex flex-col bg-white text-gray-700 p-4 overflow-hidden h-full max-w-3xl m-auto z-0 ">
            {/* 模块解析*/}
            <div class="absolute p-2 w-full top-0 left-0 z-50 bg-gray-100/30 backdrop-blur-md">
                <Description description={description()}></Description>
            </div>

            {/* 具体模块的内容 */}
            <div className="flex-grow overflow-y-auto overflow-x-hidden my-2 pt-24">
                <ErrorBoundary
                    fallback={(err, reload) => (
                        <ErrorPage err={err} reload={reload}></ErrorPage>
                    )}>
                    <Route path="/page/:pageName" element={AsyncPage}></Route>
                </ErrorBoundary>
            </div>
        </section>
    );
};
