import { render, Show } from "solid-js/web";
import "./style/global.css";
import Main from "./components/Main";
import Dependence from "./components/dependencePanel/Dependence";
import { ModuleStore } from "./components/dependencePanel/ModuleStore";
import { HelperBar } from "./HelperBar";
import { CodeViewerWrapper } from "./CodeViewerWrapper";
/** 加载loading 的 WebComponent */
import "wc-spinners";
import { onMount } from "solid-js";
import { router } from "./router/index";
const App = () => {
    onMount(() => {
        router.navigate(window.location.hash.replace("#", ""));
    });
    return (
        <section className="h-screen flex flex-col relative font-song select-none ">
            <header className="flex w-full justify-center bg-white ">
                <div className="w-full px-8 py-2 ">
                    <div className="text-2xl">DEMO-PAGES</div>
                </div>
            </header>
            <HelperBar></HelperBar>

            <main className="flex-grow bg-gray-50 p-4 overflow-auto">
                <Main></Main>
            </main>
            <Show when={ModuleStore.dependence.show}>
                <div className="absolute bottom-0 w-full h-1/2">
                    <Dependence></Dependence>
                </div>
            </Show>
            <CodeViewerWrapper></CodeViewerWrapper>
        </section>
    );
};
render(
    () => <App />,

    document.body
);
