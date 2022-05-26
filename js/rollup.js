// 导入打包产物
import { Compiler, sky_module } from "../rollup-web/dist/index.js";
import "https://fastly.jsdelivr.net/npm/systemjs@6.12.1/dist/system.min.js";
// 导入各种插件
import { initBabel, babel } from "rollup-web/dist/plugins/babel.js";
import json from "@rollup/plugin-json";

// 构建一个给 Solid 内部的 打包信息渠道
import mitt from "mitt";
const RollupHub = mitt();
globalThis.RollupHub = RollupHub;

import postcss from "https://esm.sh/postcss";
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
        {
            name: "css",

            async load(id) {
                if (/\.css$/.test(id)) {
                    const text = await fetch(id).then((res) => res.text());
                    const css = await postcss().process(text);
                    return `
                    const link = document.createElement('style')
                    link.type="text/css"
                    link.innerHTML = \`${css}\`
                    document.head.appendChild(link)`;
                }
            },
        },

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
    // 纳入打包的 url 地址，使用 picomatch 匹配
    bundleArea: [CDN + "**"],
});
const result = await compiler.evaluate("./src/index.tsx");
console.log(result);
