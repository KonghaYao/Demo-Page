import { loadScript } from "../utils/loadScript";

export default async function Runkit() {
    await loadScript("https://embed.runkit.com");
    let dom;
    var notebook = (globalThis as any).RunKit.createNotebook({
        // the parent element for the new notebook
        element: dom,
        // specify the source of the notebook
        source: '// GeoJSON!\nvar getJSON = require("async-get-json");\n\nawait getJSON("https://storage.googleapis.com/maps-devrel/google.json");',
    });
    return <div ref={dom}></div>;
}
