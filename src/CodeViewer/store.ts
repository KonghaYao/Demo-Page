import { createStore } from "solid-js/store";
import mitt from "mitt";
/** 用于模块间数据通信 */
export const CodeViewerEvent = mitt<{
    showCode: string;
}>();

export const [store, updateStore] = createStore({
    show: false,
    src: "",
});
CodeViewerEvent.on("showCode", (src) => {
    updateStore({
        show: true,
        src,
    });
});
