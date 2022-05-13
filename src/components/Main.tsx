import { createSignal, ErrorBoundary, lazy, Suspense } from "solid-js";
import { Dynamic } from "solid-js/web";
import { CDN } from "../global";
import { Route } from "../router/index";

import { Description } from "./Description";
import { ErrorPage } from "./LoadingPage/ErrorPage";
import { Loading } from "./LoadingPage/loading";
import { ModuleDescription } from "./ModuleDescription";

export default function Home() {
    const [description, setDescription] = createSignal({
        title: "Unknown Module",
        desc: "加载信息中。。。",
    } as ModuleDescription);

    const AsyncPage = (pageName: string) => {
        const Page = lazy(async () => {
            console.log("%c跳转到" + pageName, "color:red");
            const module = new URL(`./src/pages/${pageName}.tsx`, CDN);
            return import(module.toString()).then((module) => {
                if ("description" in module) setDescription(module.description);
                return module;
            });
        });
        return (
            <Suspense fallback={<Loading></Loading>}>
                <Page></Page>
            </Suspense>
        );
    };

    return (
        <section className="flex flex-col bg-white text-gray-700 p-4 overflow-hidden h-full max-w-3xl m-auto">
            {/* 模块解析*/}
            <Description description={description()}></Description>

            {/* 具体模块的内容 */}
            <div className="flex-grow overflow-y-auto overflow-x-hidden my-2">
                <ErrorBoundary
                    fallback={(err, reload) => (
                        <ErrorPage err={err} reload={reload}></ErrorPage>
                    )}>
                    <Route
                        path="/page/:pageName"
                        element={(match) => {
                            return match && AsyncPage(match.data!.pageName);
                            // return (
                            //     match && (
                            //         <Suspense fallback={<Loading></Loading>}>
                            //             {lazy(async () => {
                            //                 return {
                            //                     default: () => {
                            //                         return (
                            //                             <div>
                            //                                 match{Date.now()}
                            //                             </div>
                            //                         );
                            //                     },
                            //                 };
                            //             })}
                            //         </Suspense>
                            //     )
                            // );
                        }}></Route>
                </ErrorBoundary>
            </div>
        </section>
    );
}
