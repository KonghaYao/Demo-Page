import { createSignal, onMount } from "solid-js";
import { CDN } from "../global";
import { store, updateStore } from "./store";

export const CodeViewer = (props: { src: string }) => {
    let ref: HTMLDivElement;
    const [code, setCode] = createSignal("");

    onMount(async () => {
        const url = new URL(props.src, CDN);
        console.log(props.src);
        const code = await fetch(url).then((res) => res.text());
        setCode(code);
    });

    return (
        <pre class="backdrop-blur-xl bg-white/30 w-3/4 h-3/4 overflow-y-auto p-4 pt-2 rounded-lg">
            <div class="flex justify-end p-2">
                <span
                    class="material-icons"
                    onclick={() => updateStore("show", !store.show)}>
                    close
                </span>
            </div>
            <code ref={ref!}>{code()}</code>
        </pre>
    );
};
