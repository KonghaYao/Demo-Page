// ! 在 worker 中不能够使用 import map
// import {
//     Compiler,
//     sky_module,
//     PluginLoader,
// } from "../rollup-web/dist/index.js";
// import { drawDependence } from "../rollup-web/dist/plugins/drawDependence.js";
import {
    Compiler,
    sky_module,
    PluginLoader,
} from "https://fastly.jsdelivr.net/npm/rollup-web@4.0.0/dist/index.js";
import { drawDependence } from "https://fastly.jsdelivr.net/npm/rollup-web@4.0.0/dist/plugins/drawDependence.js";
import ts from "https://esm.sh/@babel/preset-typescript";
import SolidPresets from "https://esm.sh/babel-preset-solid@1.3.13";
// 导入各种插件
const [{ default: json }, { babelCore }, { postcss }] =
    await PluginLoader.loads("plugin-json", "babel.core", "postcss");
console.log("加载插件完成");

const isDev = () => globalThis.location.host.split(":")[0] === "127.0.0.1";
const CDN = isDev()
    ? globalThis.location.origin + "/"
    : "https://fastly.jsdelivr.net/gh/konghayao/Demo-Page/";
const RollupConfig = {
    plugins: [
        json(),
        babelCore({
            babelrc: {
                presets: [ts, SolidPresets],
            },
            extensions: [".tsx", ".ts"],
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
        // css(),
        postcss(),

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
    autoBuildFetchHook: false,
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
compiler.useWorker();
