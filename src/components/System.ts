import mitt from "mitt";
import { createStore } from "solid-js/store";
export const SystemEvents = mitt<{
    changePage: string;
}>();
export const [System, setSystem] = createStore({
    moduleName: "",
});
SystemEvents.on("changePage", (value) => {
    setSystem("moduleName", value);
});
