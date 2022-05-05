import { createStore } from "solid-js/store";
import mitt from "mitt";

/** 用于模块间数据通信 */
export const ModuleEvents = mitt<{
    filterUpdate: {};
}>();
export const [ModuleStore, updateStore] = createStore({
    dependence: {
        show: true,
        renderFileTree: {
            show: false,
        },
    },
});
