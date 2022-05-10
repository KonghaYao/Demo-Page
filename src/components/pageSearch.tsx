import { SystemEvents } from "./System";
import 'xy-ui/components/xy-input.js';
export function PageSearch() {
    function handle(this: { value: string }) {
        SystemEvents.emit("changePage", this.value);
        window.location.hash = "#" + this.value;
    }
    return (
        <div class="w-full flex bg-white rounded-xl overflow-hidden mx-4 max-w-sm">
            {/* @ts-ignore */}
            <xy-input class=" flex-grow" type="search" onsubmit={handle} />

        </div>
    );
}
