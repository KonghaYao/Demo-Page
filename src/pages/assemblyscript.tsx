import asc, { APIOptions } from "assemblyscript/dist/asc";
import loader from "@assemblyscript/loader"; // or require

import { createMemo, createResource, createSignal } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import { createStore } from "solid-js/store";
export const description: ModuleDescription = {
    fileName: "assemblyscript",
    title: "AssemblyScript",
    desc: "AssemblyScript 是 Typescript-like 的 WebAssembly 编写语言",
    link: [
        "https://www.assemblyscript.org/",
        "https://www.npmjs.com/package/assemblyscript",
        "https://github.com/AssemblyScript/assemblyscript",
    ],
};

/* 创建源代码文件系统环境 */
const createFileSystem = () => ({
    "index.ts": `
// Demo 使用了 add 作为导出，所以需要使用的话，需要 add 导出。
export function add(a: i32, b: i32): i32 {
    const d = "263723";
    console.log(d);
    return a + b
}`,
    "asconfig.json": JSON.stringify({
        entries: ["./index.ts"],
        options: {
            importTable: false,
        },
        targets: {
            release: {
                optimize: false,
                outFile: "module.wasm",
            },
            debug: {
                debug: false,
                outFile: "module.debug.wasm",
            },
        },
    }),
});
const [fileStore, setStore] = createStore(createFileSystem());

export default function () {
    let container: HTMLTextAreaElement;
    const [InputText, setInputText] = createSignal("2 3");
    const InputParams = createMemo(() => {
        return InputText()
            .split(" ")
            .map((i) => parseInt(i));
    });

    const [wasm, { refetch: reBuild }] = createResource(async () => {
        const fileList: Uint8Array[] = [];
        return asc
            .main(
                ["index.ts", "--config", "asconfig.json"],
                createAscConfig((file) => {
                    fileList.push(file);
                })
            )
            .then(() => fileList[0]);
    });

    const [runResult, { refetch }] = createResource(async () => {
        if (wasm()) {
            return loader
                .instantiate<any>(wasm()!, {
                    // env 内传递的变量相当于是 as 代码中的全局变量
                    env: {
                        /* @ts-ignore */
                        "console.log"(e) {
                            console.log(e);
                        },
                    },
                })
                .then(({ exports }) => {
                    return exports.add(...InputParams());
                });
        }
    });

    return (
        <div>
            <pre>
                <textarea
                    ref={container!}
                    value={fileStore["index.ts"]}
                    onInput={(e) =>
                        setStore("index.ts", e.currentTarget.value)
                    }></textarea>
                ;
            </pre>
            <div>
                <label htmlFor="input">输入参数</label>
                <input
                    type="text"
                    placeholder="请用空格分割你的输入参数，任何数据都会作为数值输入"
                    value={InputText()}
                    onclick={(e) => setInputText(e.currentTarget.value)}
                />
            </div>
            <div>
                <button onclick={reBuild}>重新构建</button>
                <button onclick={refetch}> 重新执行</button>
            </div>
            <div>{runResult}</div>
        </div>
    );
}

/*  ASC 在编译时需要的一些文件系统环境 */
const createAscConfig = (saveTo: (file: Uint8Array) => void) =>
    ({
        readFile(name, baseDir) {
            if (name in fileStore) {
                return (fileStore as any)[name];
            } else {
                return null;
            }
        },
        writeFile(name, data, baseDir) {
            console.log("wasn Build: ", name, data);
            saveTo(data);
        },
        listFiles(dirname, baseDir) {
            return [];
        },
        stderr: {
            write(e) {
                console.error(e);
            },
        },
        stdout: {
            write(e) {
                console.info(e);
            },
        },
    } as APIOptions);
