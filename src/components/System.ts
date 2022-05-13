import mitt from "mitt";
import { createStore } from "solid-js/store";
import { router } from "../router/index";
export const SystemEvents = mitt<{
    changePage: string;
}>();
export const [System, setSystem] = createStore({
    moduleName: window.location.hash.replace("#", ""),
});
SystemEvents.on("changePage", (value) => {
    // setSystem("moduleName", value);
    // router.navigate(`/page/${value}`);
});
