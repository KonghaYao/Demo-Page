import { render, Show } from "solid-js/web";
import "./style/global.css";
import Main from "./components/Main";
import Dependence from "./components/dependencePanel/Dependence";
import { ModuleStore } from "./components/dependencePanel/ModuleStore";
import { HelperBar } from "./HelperBar";
import { CodeViewerWrapper } from "./CodeViewerWrapper";
/** 加载loading 的 WebComponent */
import "wc-spinners";
import Test from "./router/test";
const App = () => {
    return (
        <section className="h-screen flex flex-col relative font-song select-none ">
            <header className="flex w-full justify-center bg-white ">
                <div className="w-full px-8 py-2 ">
                    <div className="text-2xl">DEMO-PAGES</div>
                </div>
                <div></div>
            </header>
            <Test></Test>
            <HelperBar></HelperBar>
            <main className="flex-grow bg-gray-50 p-4 ">
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
