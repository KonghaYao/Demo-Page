import { onMount } from "solid-js";
import { loadScript } from "../utils/loadScript";

export default function Runkit() {
    let runkit: HTMLDivElement;
    onMount(() => {
        loadScript("https://embed.runkit.com").then(() => {
            console.log(runkit);
            (globalThis as any).RunKit.createNotebook({
                // the parent element for the new notebook
                element: runkit,
                // specify the source of the notebook
                source: '// GeoJSON!\nvar getJSON = require("async-get-json");\n\nawait getJSON("https://storage.googleapis.com/maps-devrel/google.json");',
            });
        });
    });

    return <div ref={runkit!}></div>;
}
