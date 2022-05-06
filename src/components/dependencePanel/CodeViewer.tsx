import { createSignal, onMount } from "solid-js";
import { updateStore } from "./ModuleStore";

export const CodeViewer = (props: { src: string; languages: string[] }) => {
    let ref: HTMLDivElement;
    const [code, setCode] = createSignal("");

    onMount(async () => {
        const code = await fetch(new URL(props.src, window.location.href)).then(
            (res) => res.text()
        );
        setCode(code);
    });

    return (
        <pre class="backdrop-blur-xl bg-white/30 w-3/4 h-3/4 overflow-y-auto p-4 pt-2 rounded-lg">
            <div class="flex justify-end p-2">
                <span
                    class="material-icons"
                    onclick={() => updateStore("codeViewer", "show", false)}>
                    close
                </span>
            </div>
            <code ref={ref!}>{code()}</code>
        </pre>
    );
};
