import { createStore } from "solid-js/store";
import mitt from "mitt";
import { GraphData } from "@antv/g6";

/** 用于模块间数据通信 */
export const ModuleEvents = mitt<{
    filterUpdate: {};
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
        // 必须为静态属性，不能被 store 解析
        get mapper() {
            return baseStore.mapper;
        },
        set mapper(data) {
            baseStore.mapper = data;
        },
    },
});
