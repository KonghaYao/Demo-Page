import { createStore } from "solid-js/store";
import mitt from "mitt";
export const ModuleEvents = mitt<{
    filterUpdate: {};
}>();
