import { render } from "solid-js/web";
import "./style/global.css";
import { PageViewer } from "./components/Main";
import { HelperBar } from "./HelperBar";
import { CodeViewerWrapper } from "./CodeViewerWrapper";
import { PageList } from "./PageList/index";
/** 加载loading 的 WebComponent */
await import("wc-spinners");

/* shoelace 的样式表 */
await loadLink(
    "https://unpkg.com/@shoelace-style/shoelace@2.0.0-beta.73/dist/themes/light.css"
);
import { onMount } from "solid-js";
import { Route, router } from "./router/index";
import { loadLink } from "./utils/loadScript";
import { DependenceWrapper } from "./DependenceWrapper";
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

            <main className="flex-grow bg-gray-50 p-4 overflow-auto noise-bg">
                <Route path="/page/:tagname" element={PageViewer}></Route>
                <Route path="/" element={PageList}></Route>
            </main>
            <DependenceWrapper></DependenceWrapper>
            <CodeViewerWrapper></CodeViewerWrapper>
        </section>
    );
};
render(() => <App />, document.body);
