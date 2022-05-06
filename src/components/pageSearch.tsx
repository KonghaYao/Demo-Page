import { SystemEvents } from "./System";
export function PageSearch() {
    let input: HTMLInputElement;

    function handle() {
        SystemEvents.emit("changePage", input.value);
        window.location.hash = "#" + input.value;
    }
    return (
        <div class="w-full flex bg-white rounded-xl overflow-hidden mx-4 max-w-sm">
            <input class=" flex-grow" type="text" ref={(el) => (input = el)} />
            <button className="bg-sky-400 text-white px-2" onClick={handle}>
                点我加载
            </button>
        </div>
    );
}
