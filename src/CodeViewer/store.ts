import { createStore } from "solid-js/store";
import mitt from "mitt";
/** 用于模块间数据通信 */
export const CodeViewerEvent = mitt<{
    showCode: string;
}>();

export const [store, updateStore] = createStore({
    show: false,
    src: "",
    /** prismjs 中的 语言名称 对应的后缀名*/
    language: new Map([
        ["tsx", ["tsx", "typescript", "jsx"]],
        ["ts", ["typescript"]],
        ["css",["css"]],
    ]),
});
CodeViewerEvent.on("showCode", (src) => {
    if(src){
        updateStore({
            show: true,
            src,
        });
    }
});
