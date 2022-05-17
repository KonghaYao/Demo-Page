import { For } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import { CDN } from "../global";
import { Link } from "../router/index";

const pageList: ModuleDescription[] = await fetch(
    new URL("./script/PageList.json", CDN).toString()
).then((res) => res.json());

export const PageList = () => {
    return (
        <div class="grid grid-cols-4 gap-8">
            <For each={pageList}>
                {(data) => <PageCard data={data}></PageCard>}
            </For>
        </div>
    );
};
const PageCard = (props: { data: ModuleDescription }) => {
    return (
        <div class="flex flex-col p-4 rounded-xl bg-gray-100">
            <header class="text-sm font-title">{props.data.title}</header>
            <div class="flex-grow text-sm text-gray-500 line-clamp-3">
                {props.data.desc}
            </div>
            <footer>
                <Link
                    href={`/page/${props.data.fileName}`}
                    element={<button>跳转</button>}></Link>
            </footer>
        </div>
    );
};
