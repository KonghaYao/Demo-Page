import { createSignal } from "solid-js";
function handle(e: InputEvent) {
    console.log(e.data);
}
export default function Home() {
    const [queryText, setCount] = createSignal("");

    return (
        <section class="bg-gray-100 text-gray-700 p-8">
            <input type="text" onInput={handle} />
        </section>
    );
}
