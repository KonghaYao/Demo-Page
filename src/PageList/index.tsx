import { For } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import { CDN } from "../global";
import { Link } from "../router/index";

const pageList: ModuleDescription[] = await fetch(
    new URL("./script/PageList.json", CDN).toString()
).then((res) => res.json());

export const PageList = () => {
    return (
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-8 xl:grid-cols-4 lg:grid-cols-3  lg:max-w-4xl m-auto">
            <For each={pageList}>
                {(data) => <PageCard data={data}></PageCard>}
            </For>
        </div>
    );
};
const PageCard = (props: { data: ModuleDescription }) => {
    return (
        <div class="flex flex-col p-4 rounded-xl bg-gray-100">
            <header class=" font-sans font-bold">{props.data.title}</header>
            <div class="flex-grow text-sm text-gray-500 line-clamp-3">
                {props.data.desc}
            </div>
            <footer class="flex items-center">
                <div class="flex-grow"></div>
                <Link
                    href={`/page/${props.data.fileName}`}
                    element={
                        <button class="material-icons">
                            keyboard_double_arrow_right
                        </button>
                    }></Link>
            </footer>
        </div>
    );
};
