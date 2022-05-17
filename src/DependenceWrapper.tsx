import { Show } from "solid-js/web";
import { Component, lazy } from "solid-js";
import { ModuleStore } from "./components/dependencePanel/ModuleStore";

export const DependenceWrapper: Component<{}> = () => {
    const LazyDependence = lazy(async () => {
        return import("./components/dependencePanel/Dependence");
    });
    return (
        <Show when={ModuleStore.dependence.show}>
            <div className="absolute bottom-0 w-full h-1/2">
                <LazyDependence></LazyDependence>
            </div>
        </Show>
    );
};
