import {
    Compiler,
    sky_module,
    PluginLoader,
} from "https://fastly.jsdelivr.net/npm/rollup-web@3.7.10/dist/index.js";

// 导入各种插件
const { default: json } = await PluginLoader.load("plugin-json");
const { babelCore } = await PluginLoader.load("babel.core");
const { css } = await PluginLoader.load("css");

import {
    drawDependence,
    MapperStore,
} from "https://fastly.jsdelivr.net/npm/rollup-web@3.7.10/dist/plugins/drawDependence.js";
// 注入全局，这样子内部模块可以获取
globalThis.MapperStore = MapperStore;

const isDev = () => globalThis.location.host.split(":")[0] === "127.0.0.1";
const CDN = isDev()
    ? globalThis.location.origin + "/"
    : "https://fastly.jsdelivr.net/gh/konghayao/Demo-Page/";
import ts from "https://esm.sh/@babel/preset-typescript";
import SolidPresets from "https://esm.sh/babel-preset-solid@1.3.13";
const RollupConfig = {
    plugins: [
        json(),
        babelCore({
            babelrc: {
                presets: [SolidPresets, ts],
            },
            extensions: [".tsx", ".ts", ""],
            log(id) {
                // console.log("%cbabel ==> " + id, "color:blue");
            },
        }),
        sky_module({
            cdn: "https://cdn.skypack.dev/",
            rename: {
                colorthief: "colorthief@2.3.2/dist/color-thief.mjs",
                "solid-js": "solid-js@1.4.2",
                "solid-js/web": "solid-js@1.4.2/web",
                "solid-js/store": "solid-js@1.4.2/store",
                "assemblyscript/dist/asc": "assemblyscript/dist/asc.js",
            },
        }),
        css(),

        drawDependence({
            projectRoot: CDN,
            log(mapperTag, newestMapper) {},
            mapperTag: "default",
        }),
    ],
};

const compiler = new Compiler(RollupConfig, {
    // 用于为相对地址添加绝对地址
    root: CDN,
    // 为没有后缀名的 url 添加后缀名
    extensions: [".tsx", ".ts", ".js", ".json", ".css"],
    log(url) {
        console.log("%c Download ==> " + url, "color:green");
    },
    useDataCache: {
        ignore: isDev
            ? ["src/pages/*.tsx", "script/PageList.json"].map((i) => CDN + i)
            : [],
        maxAge: 24 * 60 * 60,
    },
    extraBundle: [],
});
console.log(compiler);
compiler.useWorker();
