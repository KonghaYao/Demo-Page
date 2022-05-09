import { Show } from "solid-js";
import { CodeViewer } from "./CodeViewer/CodeViewer";
import { store, updateStore } from "./CodeViewer/store";

export function CodeViewerWrapper() {
    let container:HTMLDivElement
    const close = function ( e: Event) {
        e.stopPropagation();
        if (e.currentTarget === container) {
            updateStore("show", false);
        }
    };
    return (
        <Show when={store.show}>
            <div
                class="absolute backdrop-blur-lg bg-white/40 w-screen h-screen top-0 left-0 flex justify-center items-center z-50"
                onClick={close} ref={container!}>
                <CodeViewer src={store.src}></CodeViewer>
            </div>
        </Show>
    );
}
