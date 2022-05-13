import { SystemEvents } from "./System";
import "xy-ui/components/xy-input.js";
export function PageSearch() {
    function handle(this: { value: string }) {
        SystemEvents.emit("changePage", this.value);
    }

    return (
        <div className="w-full flex bg-white rounded-xl overflow-hidden mx-4 max-w-sm">
            {/* @ts-ignore */}
            <xy-input
                className=" flex-grow"
                type="search"
                onsubmit={handle}
                attr:defaultvalue={""}
            />
        </div>
    );
}
