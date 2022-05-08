import { For } from "solid-js";
import { ModuleDescription } from "./ModuleDescription";

/** 展示模块的组件 */
export const Description = (props: { description: ModuleDescription }) => {
    return (
        <div class="rounded-lg border-2 border-orange-400 p-4">
            <div class="flex justify-between text-lg font-bold">
                <span>{props.description.title}</span>

                <div class="grid grid-flow-col gap-2">
                    <For each={props.description.link}>
                        {(src) => <LinkComponent src={src}></LinkComponent>}
                    </For>
                </div>
            </div>
            <p class="text-sm text-gray-400">{props.description.desc}</p>
        </div>
    );
};
const LinkComponent = (props: { src: string }) => {
    return (
        <a target="_blank" href={props.src}>
            <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex justify-center items-center  hover:scale-125 transition-transform">
                <img class="w-11/12 h-11/12" src={findLinkIcon(props.src)} />
            </div>
        </a>
    );
};
const findLinkIcon = (src: string) => {
    let url = new URL(src);
    let name = "link";
    if (/npm/.test(url.host)) {
        name = "npm";
    } else if (/github/.test(url.host)) {
        return `https://cdn.jsdelivr.net/gh/primer/octicons/icons/mark-github-16.svg`;
    }
    return `https://cdn.jsdelivr.net/gh/astrit/css.gg/icons/svg/${name}.svg`;
};
