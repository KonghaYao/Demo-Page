import { createSignal, lazy, Suspense, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { CodeViewer } from "./dependencePanel/CodeViewer";
import { ModuleStore } from "./dependencePanel/ModuleStore";
export default function Home() {
    const pageName = window.location.hash.replace("#", "");
    let input: HTMLInputElement;
    const [queryText, setText] = createSignal(pageName || "index");
    function handle() {
        setText(input.value);
        window.location.hash = "#" + input.value;
    }
    const AsyncPage = (pagesName: string) => () => {
        const Page = lazy(() => {
            if (pagesName === "") return Promise.resolve(<div>Loading</div>);
            console.log("%c跳转到" + pagesName, "color:red");
            return import(`../pages/${pagesName}.tsx`);
        });
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Page />
            </Suspense>
        );
    };

    return (
        <section class="flex flex-col bg-white text-gray-700 p-4 overflow-hidden h-full">
            <div class="w-full flex py-2 shadow-lg shadow-gray-300 rounded-xl overflow-hidden">
                <input
                    class="mx-4 flex-grow"
                    type="text"
                    ref={(el) => (input = el)}
                />
                <button className="bg-sky-400 text-white px-2" onClick={handle}>
                    点我加载
                </button>
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
