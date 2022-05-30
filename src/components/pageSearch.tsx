import { SystemEvents } from "./System";
import data from "../../script/PageList.json";
import { For } from "solid-js";
await import("xy-ui/components/xy-select.js");
await import("xy-ui/components/xy-input.js");
await import("xy-ui/components/xy-option.js");

export function PageSearch() {
    function handle(this: { value: string }) {
        SystemEvents.emit("changePage", this.value);
    }

    return (
        <div class="h-full w-full">
            <xy-select
                placeholder="搜索仓库"
                search
                block
                className="w-48  h-full bg-white rounded-xl   "
                onchange={handle}>
                <For each={data}>
                    {(info) => (
                        <xy-option
                            attr:value={info.fileName}
                            attr:key={[info.fileName, info.title].join("-")}>
                            {info.title}
                        </xy-option>
                    )}
                </For>
            </xy-select>
        </div>
    );
}
