import { createMemo, lazy, Show, Suspense } from "solid-js";
import { store } from "./CodeViewer/store";
import { Loading } from "./components/LoadingPage/loading";

export function CodeViewerWrapper() {
    let container: HTMLDivElement;
    const LazyCodeViewer = lazy(async () =>
        import("./CodeViewer/CodeViewer").then((res) => {
            return { default: res.CodeViewer };
        })
    );
    const show = createMemo(() => {
        console.warn(store.show);
        return store.show;
    });
    return (
        <Show when={show()}>
            <div
                className="absolute backdrop-blur-lg bg-white/40 w-screen h-screen top-0 left-0 flex justify-center items-center z-50"
                ref={container!}>
                <Suspense fallback={<Loading></Loading>}>
                    <LazyCodeViewer src={store.src}></LazyCodeViewer>
                </Suspense>
            </div>
        </Show>
    );
}
