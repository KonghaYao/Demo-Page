import "https://fastly.jsdelivr.net/npm/systemjs@6.12.1/dist/system.min.js";
import { Compiler, sky_module } from "rollup-web/dist/index.js";
import { initBabel, babel } from "rollup-web/dist/plugins/babel.js";
import { css } from "rollup-web/dist/plugins/css.js";
import json from "@rollup/plugin-json";
import mitt from "mitt";
// 构建一个给 Solid 内部的 打包信息渠道
const RollupHub = mitt();
globalThis.RollupHub = RollupHub;

import {
    drawDependence,
    MapperStore,
} from "rollup-web/dist/plugins/drawDependence.js";
globalThis.MapperStore = MapperStore;

const isDev = () => globalThis.location.host.split(":")[0] === "127.0.0.1";
const CDN = isDev()
    ? globalThis.location.origin + "/"
    : "https://fastly.jsdelivr.net/gh/konghayao/Demo-Page/";

await initBabel();
// Solid-js 配置
import SolidPresets from "https://esm.sh/babel-preset-solid@1.3.13";
const RollupConfig = {
    plugins: [
        json(),
        babel({
            babelrc: {
                presets: [
                    SolidPresets,
                    [
                        Babel.availablePresets["typescript"],
                        {
                            // 需要使用这种方式兼容 solid 配置
                            isTSX: true,
                            allExtensions: true,
                        },
                    ],
                ],
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
            log(mapperTag, newestMapper) {
                RollupHub.emit(
                    "drawDependence",
                    {
                        nodeParts: newestMapper.getNodeParts(),
                        nodeMetas: newestMapper.getNodeMetas(),
                    },
                    newestMapper
                );
            },
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
    },
    extraBundle: [],
});
// 去除等候页面

// 开始执行打包操作
console.time("初次打包时间");
const result = await compiler.evaluate("./src/index.tsx");
console.timeEnd("初次打包时间");
globalThis.PrepareDestroy();
console.log(result);
