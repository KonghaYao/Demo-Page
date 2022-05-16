importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
importScripts("https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js");
let pyodide;
Comlink.expose({
    async init() {
        pyodide = await loadPyodide({
            // indexURL: indexUrl,
            stdout: console.log,
            stderr: console.log,
            fullStdLib: false,
        });
        await pyodide.loadPackage("micropip");
        console.log(pyodide);
    },
    eval(code) {
        return pyodide.runPythonAsync(code);
    },
    async loadPackage(package_name, runtime) {
        const micropip = pyodide.globals.get("micropip");
        await micropip.install(package_name);
        micropip.destroy();
    },
    loadedPackages() {
        return pyodide.loadedPackages;
    },
});
