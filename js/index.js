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
await initBabel();

// Solid-js 配置
import SolidPresets from "https://esm.sh/babel-preset-solid@1.3.13";
const server = new DynamicServer("_import");
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
            // 本地打包
            extensions: [".tsx", ".ts", ".js", ".json"],
            log(url) {
                console.log("%c Download ==> " + url, "color:green");
            },
        }),
        sky_module({
            cdn: "https://cdn.skypack.dev/",
        }),
        // 这是一种异步导入方案，使用 全局的一个外置 Server 来保证代码的正确执行
        server.createPlugin({}),
        {
            name: "css",
            async load(id) {
                if (/\.css$/.test(id)) {
                    const text = await fetch(id).then((res) => res.text());

                    return `const style = document.createElement('style')
                     style.innerHTML = \`${text}\`
                    document.body.appendChild(style)
                
                `;
                }
            },
        },
    ],
};
/** 需要在使用前注册一下这个server */
server.registerRollupPlugins(config.plugins);
const data = await useRollup(config);
await ModuleEval(data.output[0].code);
console.log("初始化打包完成");
