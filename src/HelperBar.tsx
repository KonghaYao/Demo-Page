import { updateStore } from "./components/dependencePanel/ModuleStore";
import { PageSearch } from "./components/pageSearch";

export function HelperBar() {
    return (
        <nav class="flex p-2 px-4 bg-gray-100 items-center">
            <div class="flex-grow text-white flex items-center">
                <div
                    class="material-icons rounded-full p-1 bg-green-400"
                    onclick={() => updateStore("dependence", "show", true)}>
                    map
                </div>
                <div class="material-icons bg-orange-400 rounded-full p-1">
                    source
                </div>
            </div>
            <PageSearch></PageSearch>
        </nav>
    );
}