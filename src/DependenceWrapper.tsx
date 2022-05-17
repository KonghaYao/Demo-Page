import { Show } from "solid-js/web";
import { Component, lazy, Suspense } from "solid-js";
import { ModuleStore } from "./components/dependencePanel/ModuleStore";
import { Loading } from "./components/LoadingPage/loading";

export const DependenceWrapper: Component<{}> = () => {
    const LazyDependence = lazy(async () => {
        return import("./components/dependencePanel/Dependence");
    });
    return (
        <Show when={ModuleStore.dependence.show}>
            <div className="absolute bottom-0 w-full h-1/2">
                <Suspense fallback={<Loading></Loading>}>
                    <LazyDependence></LazyDependence>
                </Suspense>
            </div>
        </Show>
    );
};
