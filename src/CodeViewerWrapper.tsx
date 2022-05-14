import { Show } from "solid-js";
import { CodeViewer } from "./CodeViewer/CodeViewer";
import { store } from "./CodeViewer/store";

export function CodeViewerWrapper() {
    let container: HTMLDivElement;

    return (
        <Show when={store.show}>
            <div
                className="absolute backdrop-blur-lg bg-white/40 w-screen h-screen top-0 left-0 flex justify-center items-center z-50"
                ref={container!}>
                <CodeViewer src={store.src}></CodeViewer>
            </div>
        </Show>
    );
}
