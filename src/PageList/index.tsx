import { For } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import { CDN } from "../global";
import { Link } from "../router";

const pageList: ModuleDescription[] = await fetch(
    new URL("./script/PageList.json", CDN)
).then((res) => res.json());
export const PageList = () => {
    return (
        <div>
            <For each={pageList}>
                {(data) => <PageCard data={data}></PageCard>}
            </For>
        </div>
    );
};
const PageCard = (props: { data: ModuleDescription }) => {
    return (
        <div>
            <div>{props.data.title}</div>
            <div>{props.data.desc}</div>
            <Link
                href={`/page/${props.data.fileName}.tsx`}
                element={<button>跳转</button>}></Link>
        </div>
    );
};
