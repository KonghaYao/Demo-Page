import { Show } from "solid-js";
import { CodeViewer } from "./CodeViewer/CodeViewer";
import { store } from "./CodeViewer/store";

export function CodeViewerWrapper() {
    return (
        <Show when={store.show}>
            <div class="absolute w-screen h-screen top-0 left-0 flex justify-center items-center z-50">
                <CodeViewer src={store.src}></CodeViewer>
            </div>
        </Show>
    );
}
