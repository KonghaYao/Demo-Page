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
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
await initBabel();

// Solid-js 配置
import SolidPresets from "https://esm.sh/babel-preset-solid";
const server = new DynamicServer("_import");
Babel.registerPreset(SolidPresets);
const config = {
    // 直接采用 src 目录下的 index.ts 进行打包实验
    input: "./src/index.tsx",
    output: {
        format: "es",
    },
    plugins: [
        json(),
        alias({
            entries: [{ find: "@", replacement: "./" }],
        }),
        commonjs({
            extensions: [".cjs", ".js"],
        }),
        replace({
            __buildDate__: () => JSON.stringify(3434),
            __buildVersion: "15",
        }),
        babel({
            babelrc: {
                presets: [
                    [
                        Babel.availablePresets["typescript"],
                        {
                            // 需要使用这种方式兼容 solid 配置
                            isTSX: true,
                            allExtensions: true,
                        },
                    ],
                    [SolidPresets, { generate: "dom", hydratable: true }],
                ],
                // plugins: [
                //     Babel.availablePlugins["transform-typescript"],
                //     Babel.availablePlugins["transform-jsx"],
                // ],
            },
            extensions: [".tsx", ".ts"],
            log(id) {
                console.log("%cbabel ==> " + id, "color:blue");
            },
        }),
        web_module({
            // 本地打包
            extensions: [".tsx", ".ts", ".js", ".json"],
            log(url) {
                console.log("%c网站文件打包 ==> " + url, "color:green");
            },
        }),
        sky_module({
            cdn: "https://cdn.skypack.dev/",
        }),
        // 这是一种异步导入方案，使用 全局的一个外置 Server 来保证代码的正确执行
        server.createPlugin({}),
    ],
};
/** 需要在使用前注册一下这个server */
server.registerRollupPlugins(config.plugins);
const data = await useRollup(config);
await ModuleEval(data.output[0].code);
console.log("初始化打包完成");
