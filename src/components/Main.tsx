import { createSignal, lazy, Suspense, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
export default function Home() {
    const pageName = window.location.hash.replace("#", "");
    let input: HTMLInputElement;
    const [queryText, setText] = createSignal(pageName || "index");
    function handle() {
        setText(input.value);
    }
    const AsyncPage = (pagesName: string) => () => {
        const Page = lazy(() => {
            if (pagesName === "") return Promise.resolve(<div>Loading</div>);
            console.log("%c跳转到" + pagesName, "color:red");
            return import(`../pages/${pagesName}.tsx`);
        });
        return (
            <Suspense>
                <Page />
            </Suspense>
        );
    };

    return (
        <section class="flex flex-col bg-white text-gray-700 p-8 overflow-hidden">
            <div class="w-full flex py-2 shadow-lg shadow-gray-300 rounded-xl overflow-hidden">
                <input
                    class="mx-4 flex-grow"
                    type="text"
                    ref={(el) => (input = el)}
                />
                <button className="bg-sky-400 text-white px-2" onBlur={handle}>
                    点我加载
                </button>
            </div>
            <div class="flex-grow overflow-y-auto overflow-x-hidden ">
                <Dynamic component={AsyncPage(queryText())} />
            </div>
        </section>
    );
}
