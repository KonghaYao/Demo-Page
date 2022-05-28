import { Notify } from "notiflix";
import { createEffect, createMemo, createResource } from "solid-js";
import type Spreadsheet from "x-data-spreadsheet";
import { ModuleDescription } from "../components/ModuleDescription";

export const description: ModuleDescription = {
    fileName: "x-data-spreadsheet",
    title: "在线 Excel 插件",
    desc: "在网页端打开 XLSX 文件",
    link: [
        "https://www.npmjs.com/package/x-data-spreadsheet",
        "https://github.com/myliang/x-spreadsheet",
    ],
};
import { loadLink, loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";
await loadLink(
    "https://unpkg.com/x-data-spreadsheet@1.1.5/dist/xspreadsheet.css"
);
await loadScript(
    "https://unpkg.com/x-data-spreadsheet@1.1.5/dist/xspreadsheet.js"
);
await loadScript("https://unpkg.com/xlsx/dist/xlsx.full.min.js");
const x_spreadsheet =
    useGlobal<typeof import("x-data-spreadsheet")["default"]>("x_spreadsheet");
const XLSX = useGlobal<typeof import("xlsx")>("XLSX");
const { stox } = await import("../utils/xlsxspread");
export default function () {
    let container: HTMLDivElement;
    const [file, { mutate, refetch }] = createResource(
        new Uint8Array(),
        async () => {
            return fetch(
                "https://unpkg.com/xlsx2csv@1.0.12/sample/sample.xlsx"
            ).then((res) => res.arrayBuffer());
        }
    );
    const wb = createMemo(() => {
        if (file()) {
            Notify.success("加载数据完成");
            return XLSX.read(file(), {
                type: "array",
            });
        }
    });
    let s: Spreadsheet;
    createEffect(() => {
        if (wb()) {
            if (s) {
                s.deleteSheet();
                container.innerHTML = "";
            }
            const { width, height } = getComputedStyle(container);
            console.log(height);
            s = new x_spreadsheet(container, {
                mode: "edit", // edit | read
                showToolbar: true,
                showGrid: true,
                showContextmenu: true,
                view: {
                    height: () => parseInt(height),
                    width: () => parseInt(width),
                },
            })
                .loadData(stox(wb()!)) // load data
                .change((data) => {
                    // save data to db
                    console.log(data);
                });
        }
    });

    return (
        <div class="h-full w-full flex-grow flex flex-col">
            <input
                type="file"
                oninput={async (e) => {
                    const buffer =
                        await e.currentTarget.files![0].arrayBuffer();
                    mutate(buffer);
                }}></input>
            <div class="w-full flex-grow" ref={container!}></div>
        </div>
    );
}
