import {
    createEffect,
    createMemo,
    createResource,
    createSignal,
} from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import { createStore } from "solid-js/store";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/split-panel/split-panel.js";

import type { APIOptions } from "assemblyscript/dist/asc";
import { Notify } from "notiflix";

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

/* 创建源代码文件系统环境, asc 在浏览器端没有文件系统，所以需要提供一个 */
const createFileSystem = () => ({
    "index.ts": `// Demo 使用了 add 作为导出，所以需要使用的话，需要 add 导出。
export function add(a: i32, b: i32): i32 {
    const d = "这是一个 WebAssembly 里面的文本";
    console.log(d);
    return a + b
}`,

    //! asc 配置文件
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

/*  ASC 在编译时需要的一些文件系统环境，衔接文件系统与 ASC */
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

/* 渲染主要界面 */
export default function () {
    let container: HTMLTextAreaElement;

    // 将用户输入转化成具体的数字
    const [InputText, setInputText] = createSignal("2 3");
    const InputParams = createMemo(() => {
        return InputText()
            .split(" ")
            .map((i) => parseInt(i));
    });

    // 编译 as
    const [wasm, { refetch: reBuild }] = createResource(async () => {
        const fileList: Uint8Array[] = [];
        const asc = await import("assemblyscript/dist/asc");
        return asc
            .main(
                ["index.ts", "--config", "asconfig.json"],
                createAscConfig((file) => {
                    fileList.push(file);
                })
            )
            .then(() => {
                Notify.success("编译 AssemblyScript 完成");
                return fileList[0];
            });
    });

    // 运行 as
    const [runResult, { refetch: rerun }] = createResource(async () => {
        if (wasm()) {
            let Exports: any;
            const loader = await import("@assemblyscript/loader");
            return loader
                .instantiate<any>(wasm()!, {
                    // env 内传递的变量相当于是 as 代码中的全局变量
                    env: {
                        /* @ts-ignore */
                        "console.log"(e) {
                            // WASM 内部的变量需要通过 export 进行获取使用
                            console.warn(Exports.__getString(e));
                        },
                    },
                })
                .then(({ exports }) => {
                    Exports = exports;
                    console.log(exports);
                    Notify.success("运行 AssemblyScript 完成");
                    return exports.add(...InputParams());
                });
        }
    });
    createEffect(() => {
        if (wasm()) {
            rerun();
        }
    });
    return (
        <div class="flex flex-col">
            <sl-split-panel class="h-full bg-white" position="75">
                <sl-textarea
                    class="p-2"
                    slot="start"
                    label="源代码"
                    help-text="在 Demo 中导出必须为 add 这样才能编译成功"
                    resize="none"
                    rows="7"
                    ref={container!}
                    value={fileStore["index.ts"]}
                    onInput={(e: any) =>
                        setStore("index.ts", e.currentTarget.value)
                    }></sl-textarea>
                <div class="m-4" slot="end">
                    <div class="my-2">输出结果</div>
                    {runResult}
                </div>
            </sl-split-panel>

            <div class="my-4">
                <sl-input
                    type="text"
                    label="WebAssembly 输入参数"
                    help-text="请用空格分割你的输入参数，任何数据都会作为数值输入"
                    value={InputText()}
                    onclick={(e: any) => setInputText(e.currentTarget.value)}
                />
            </div>
            <div class="my-4">
                <sl-button
                    onclick={reBuild}
                    disable={runResult.loading || wasm.loading}>
                    重新构建并执行代码
                </sl-button>
            </div>
        </div>
    );
}
