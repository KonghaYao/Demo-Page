import mitt from "mitt";
import { createStore } from "solid-js/store";
import { router } from "../router/index";
export const SystemEvents = mitt<{
    changePage: string;
}>();
export const [System, setSystem] = createStore({});
SystemEvents.on("changePage", (value) => {
    router.navigate(`/page/${value}`);
});
