// 导入打包产物
import {
    useRollup,
    web_module,
    sky_module,
    ModuleEval,
    DynamicServer,
} from "rollup-web";

// 导入各种插件
import { initBabel, babel } from "rollup-web/dist/plugins/babel.js";
import json from "@rollup/plugin-json";
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
    ? globalThis.location.href
    : "https://fastly.jsdelivr.net/gh/konghayao/Demo-Page/index.html";
await initBabel();
// Solid-js 配置
import SolidPresets from "https://esm.sh/babel-preset-solid@1.3.13";
const server = new DynamicServer("_import", CDN);
const config = {
    // 直接采用 src 目录下的 index.ts 进行打包实验
    input: "./src/index.tsx",
    output: {
        format: "es",
    },
    plugins: [
        json(),
        // alias({
        //     entries: [{ find: "@", replacement: "./" }],
        // }),
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
                console.log("%cbabel ==> " + id, "color:blue");
            },
        }),
        web_module({
            root: CDN,
            // 本地打包
            extensions: [".tsx", ".ts", ".js", ".json"],
            log(url) {
                console.log("%c Download ==> " + url, "color:green");
            },
        }),
        sky_module({
            cdn: "https://cdn.skypack.dev/",
            rename: {
                colorthief: "colorthief@2.3.2/dist/color-thief.mjs",
                "solid-js": "solid-js@1.3.17",
                "solid-js/web": "solid-js@1.3.17/web",
                "solid-js/store": "solid-js@1.3.17/store",
            },
        }),
        // 这是一种异步导入方案，使用 全局的一个外置 Server 来保证代码的正确执行
        server.createPlugin({}),
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
                    document.head.appendChild(link)
               
                    `;
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
/** 需要在使用前注册一下这个server */
server.registerRollupPlugins(config.plugins);
const data = await useRollup(config);
await ModuleEval(data.output[0].code);
console.log("初始化打包完成");
