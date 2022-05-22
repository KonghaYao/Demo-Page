import {
    createEffect,
    createResource,
    createSignal,
    For,
    onMount,
} from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import { annotate } from "rough-notation";
import Highlighter from "web-highlighter";
import Markdown from "./index";
import { createMarkdown } from "../utils/remark";
export const description: ModuleDescription = {
    fileName: "roughNotion",
    title: "Rough Notation —— 动态笔记效果",
    desc: "Rough Notation 是一个用于创建动态笔记效果的组件",
    link: [
        "https://roughnotation.com/",
        "https://github.com/rough-stuff/rough-notation",
    ],
};
import "../style/markdown.css";
import type {
    RoughAnnotation,
    RoughAnnotationType,
} from "rough-notation/lib/model";
interface StyleStore {
    type: RoughAnnotationType;
    ref: null | RoughAnnotation;
}
const styles = [
    "underline",
    "box",
    "circle",
    "highlight",
    "strike-through",
    "crossed-off",
    "bracket",
].map((i) => ({ type: i, ref: null } as StyleStore));
export default function () {
    const [selectedStyle, setSelectedStyle] = createSignal("underline");

    const changeStyle = (newStyle: StyleStore) => {
        const oldStyle = styles.find((i) => i.type === selectedStyle())!;
        if (oldStyle !== newStyle) {
            oldStyle.ref!.hide();
            newStyle.ref!.show();
            setSelectedStyle(newStyle.type);
            console.log("更换属性 ", newStyle);
        }
    };
    let container: HTMLDivElement;
    onMount(() => {
        styles.find((i) => i.type === selectedStyle())!.ref!.show();
        const highlighter = new Highlighter({
            $root: container,
            exceptSelectors: ["pre", "code"],
            verbose: true,
        });
        highlighter
            .on("selection:hover", ({ id }) => {})
            .on("selection:hover-out", ({ id }) => {})
            .on("selection:create", ({ sources }) => {
                sources
                    .map((i) => highlighter.getDoms(i.id))
                    .flat()
                    .forEach((i) => {
                        annotate(i, {
                            type: selectedStyle() as RoughAnnotationType,
                            animate: true,
                        }).show();
                    });
            });
        highlighter.run();
    });

    return (
        <div>
            <div>
                <div class="flex justify-evenly">
                    <For each={styles}>
                        {(styleObject) => {
                            return (
                                <span
                                    onclick={() => changeStyle(styleObject)}
                                    ref={(target) => {
                                        styleObject.ref = annotate(target, {
                                            type: styleObject.type,
                                            animate: true,
                                        });
                                    }}>
                                    {styleObject.type}
                                </span>
                            );
                        }}
                    </For>
                </div>
            </div>
            {/* 必须要设置父级元素为 relative 才能保证绘制刚好在图中 */}
            <div
                ref={container!}
                class="p-8 overflow-auto select-text relative">
                <Markdown></Markdown>
            </div>
        </div>
    );
}
