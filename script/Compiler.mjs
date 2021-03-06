import {
    existsSync,
    readdirSync,
    readFileSync,
    writeFileSync,
    promises,
} from "fs";
const { rm } = promises;
import { rollup } from "rollup";
import Babel from "@babel/core";
import json from "@rollup/plugin-json";
import { extname } from "path/posix";
import path from "path";
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
const exts = [".ts", ".tsx", ".mjs"];

const processCode = (code) => {
    return code
        .replace(/^await[\s\S]+?;/gm, "")
        .replace(/^((const|var|let).+?)await[\s\S]+?;/gm, "$1 null;")
        .replace(/^((const|var|let).+?)=.+?;$/gm, "$1 = null;");
};
rollup({
    input: "./script/temp.mjs",
    plugins: [
        {
            resolveId(thisFile, importer) {
                const ext = extname(thisFile);
                if (ext === "" && [".", "/"].includes(thisFile[0])) {
                    let realPath;
                    exts.find((i) => {
                        realPath = path.resolve(importer, "../", thisFile + i);
                        return existsSync(realPath);
                    });
                    return realPath;
                }
            },
            load(path) {
                const ext = extname(path);
                if (exts.includes(ext)) {
                    const code = readFileSync(path, "utf-8");

                    return Babel.transformSync(processCode(code), {
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
                } else {
                    return "";
                }
            },
        },
    ],
})
    .then((res) =>
        res.generate({
            file: "./script/result.mjs",
            format: "es",
        })
    )
    .then((res) => {
        let code = res.output[0].code
            .replace(/^import[\s\S]+?;/gm, "")
            .replace(/^delegateEvents[\s\S]+?;/gm, "");
        // ! 解决执行环境的问题
        code = "globalThis.location = {href:'4343',host:''}" + code;
        writeFileSync("./script/result.mjs", code);
    })
    .then((res) => {
        //  校验产出代码
        return import("./result.mjs")
            .then((res) => {
                const complete = res.default.every((i) => {
                    return "title" in i;
                });
                console.log(complete);
                return JSON.stringify(res.default);
            })
            .then((json) => {
                writeFileSync("./script/PageList.json", json);
            });
    })
    .then(() => {
        rm("./script/temp.mjs");
        rm("./script/result.mjs");
    });
