import { createSignal, lazy, Suspense, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
export default function Home() {
    const [queryText, setText] = createSignal("");
    function handle(e: Event) {
        const input = e.target as HTMLInputElement;
        setText(input.value);
    }
    const AsyncPage = (pagesName: string) => () => {
        const Page = lazy(() => {
            if (pagesName === "") return Promise.resolve(<div>Loading</div>);
            return import(`../pages/${pagesName}.tsx`);
        });
        return (
            <Suspense>
                <Page />
            </Suspense>
        );
    };

    return (
        <section class="bg-gray-100 text-gray-700 p-8">
            <input type="text" onBlur={handle} />
            <Dynamic component={AsyncPage(queryText())} />
        </section>
    );
}
