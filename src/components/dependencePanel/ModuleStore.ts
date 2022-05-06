import { createStore } from "solid-js/store";
import mitt from "mitt";

/** 用于模块间数据通信 */
export const ModuleEvents = mitt<{
    filterUpdate: {};
    showCode: string;
}>();
export const [ModuleStore, updateStore] = createStore({
    dependence: {
        show: false,
        filter: "",
        renderFileTree: {
            show: false,
        },
    },
    codeViewer: {
        show: false,
        src: "",
    },
});
ModuleEvents.on("showCode", (src) => {
    updateStore({
        codeViewer: {
            show: true,
            src,
        },
    });
});
