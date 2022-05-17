importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
importScripts("https://fastly.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js");
let pyodide;
Comlink.expose({
    init: async () => {
        pyodide = await loadPyodide({
            // indexURL: indexUrl,
            stdout: console.log,
            stderr: console.log,
            fullStdLib: false,
        });
        await pyodide.loadPackage("micropip");
    },
    async eval(code) {
        const result = await pyodide.runPythonAsync(code);
        console.log("python Result =>", result.toJs());
        return result.toJs();
    },
    loadPackage: async (package_name) => {
        await pyodide.loadPackage([package_name]);
    },
    pipInstall: async (package_name) => {
        const micropip = pyodide.globals.get("micropip");
        await micropip.install(package_name);
        micropip.destroy();
    },
    loadedPackages: () => {
        return pyodide.loadedPackages;
    },
});
