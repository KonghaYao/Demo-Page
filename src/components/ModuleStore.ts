import { createStore } from "solid-js/store";
import mitt from "mitt";
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
