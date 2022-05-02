import { onMount } from "solid-js";
import { loadScript } from "../utils/loadScript";

export default function Runkit() {
    onMount(() => {
        loadScript("https://embed.runkit.com").then(() => {
            let dom = document.getElementById("runkit");
            console.log(dom);
            (globalThis as any).RunKit.createNotebook({
                // the parent element for the new notebook
                element: dom,
                // specify the source of the notebook
                source: '// GeoJSON!\nvar getJSON = require("async-get-json");\n\nawait getJSON("https://storage.googleapis.com/maps-devrel/google.json");',
            });
        });
    });

    return <div id="runkit"></div>;
}
