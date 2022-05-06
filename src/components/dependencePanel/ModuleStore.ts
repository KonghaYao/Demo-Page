import { createStore } from "solid-js/store";
import mitt from "mitt";
import { GraphData } from "@antv/g6";

/** 用于模块间数据通信 */
export const ModuleEvents = mitt<{
    filterUpdate: {};
    showCode: string;
}>();

export const baseStore = {
    mapper: null as null | GraphData,
};
export const [ModuleStore, updateStore] = createStore({
    dependence: {
        show: false,
        filter: "",
        renderFileTree: {
            show: false,
        },
        get mapper() {
            return baseStore.mapper;
        },
        set mapper(data) {
            baseStore.mapper = data;
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
