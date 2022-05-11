import { readdirSync, readFileSync, writeFileSync } from "fs";
import { rollup } from "rollup";
import Babel from "@babel/core";
const files = readdirSync("./src/pages");

writeFileSync(
    "./script/temp.mjs",
    files
        .map((i, index) => {
            return `import {description as desc${index}} from "../src/pages/${i}";`;
        })
        .join("\n") +
        `export default [${files.map((i, index) => `desc${index}`).join(",")}]`
);

rollup({
    input: "./script/temp.mjs",
    plugins: [
        {
            load(path) {
                if (/.+\.tsx$/.test(path)) {
                    const code = readFileSync(path, "utf-8");
                    return Babel.transformSync(code, {
                        presets: [
                            [
                                "@babel/preset-typescript",
                                {
                                    // 需要使用这种方式兼容 solid 配置
                                    isTSX: true,
                                    allExtensions: true,
                                },
                            ],
                            "babel-preset-solid",
                        ],
                    });
                }
            },
        },
    ],
});
