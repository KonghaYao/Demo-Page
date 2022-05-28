import { For } from "solid-js";
import { GH } from "../global";
import { ModuleDescription } from "./ModuleDescription";

/** 展示模块的组件 */
export const Description = (props: {
    description: ModuleDescription;
    className?: string;
}) => {
    return (
        <div
            class={props.className}
            className=" rounded-lg border-2 border-orange-400 p-4 w-full">
            <div className="flex justify-between text-lg font-bold">
                <span>{props.description.title}</span>

                <div className="grid grid-flow-col gap-2">
                    <For each={props.description.link}>
                        {(src) => <LinkComponent src={src}></LinkComponent>}
                    </For>
                </div>
            </div>
            <p className="text-sm text-gray-400">{props.description.desc}</p>
        </div>
    );
};
const LinkComponent = (props: { src: string }) => {
    return (
        <a target="_blank" href={props.src}>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex justify-center items-center  hover:scale-125 transition-transform">
                <img
                    className="w-11/12 h-11/12"
                    src={findLinkIcon(props.src)}
                    onerror={(e) =>
                        (e.currentTarget.src =
                            GH + "astrit/css.gg/icons/svg/link.svg")
                    }
                />
            </div>
        </a>
    );
};
const findLinkIcon = (src: string) => {
    let url = new URL(src);
    if (/npmjs/.test(url.host)) {
        return GH + "astrit/css.gg/icons/svg/npm.svg";
    } else if (/github/.test(url.host)) {
        return GH + `primer/octicons/icons/mark-github-16.svg`;
    }
    return url.origin + "/favicon.ico";
};
