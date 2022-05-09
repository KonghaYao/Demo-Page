import { CodeViewerEvent } from "./CodeViewer/store";
import { updateStore } from "./components/dependencePanel/ModuleStore";
import { PageSearch } from "./components/pageSearch";
import { System } from "./components/System";
import { CDN } from "./global";

export function HelperBar() {

    return (
        <nav class="flex p-2 px-4 bg-gray-100 items-center">
            <div class="grid grid-flow-col gap-4 text-white  items-center">
                <div
                    class="material-icons rounded-full p-1 bg-green-400"
                    onclick={() => updateStore("dependence", "show", true)}>
                    map
                </div>
                <div
                    class="material-icons bg-orange-400 rounded-full p-1"
                    onclick={() => {
                        const url = new URL(
                            `/src/pages/${System.moduleName}.tsx`,
                            CDN
                        );
                        CodeViewerEvent.emit("showCode", url.toString());
                    }}>
                    source
                </div>
            </div>
            <PageSearch></PageSearch>
        </nav>
    );
}
