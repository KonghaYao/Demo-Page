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
const initColor = "#fff176";

import "@shoelace-style/shoelace/dist/components/color-picker/color-picker.js";
export default function () {
    const [selectedStyle, setSelectedStyle] = createSignal(styles[0]);
    const [color, setColor] = createSignal(initColor);
    const changeStyle = (newStyle: StyleStore) => {
        const oldStyle = selectedStyle();
        if (oldStyle !== newStyle) {
            oldStyle.ref!.hide();
            newStyle.ref!.color = color();
            newStyle.ref!.show();
            setSelectedStyle(newStyle);
            console.log("更换属性 ", newStyle);
        }
    };
    let container: HTMLDivElement;
    onMount(() => {
        const highlighter = new Highlighter({
            $root: container,
            exceptSelectors: ["pre", "code"],
            verbose: true,
            style: {
                className: "tagging",
            },
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
                            type: selectedStyle().type,
                            animate: true,
                            color: color(),
                        }).show();
                    });
            });
        highlighter.run();
        styles.find((i) => i === selectedStyle())!.ref!.show();
    });

    return (
        <div>
            <div>
                <div class="flex justify-evenly relative items-center">
                    <For each={styles}>
                        {(styleObject) => (
                            <span
                                class="flex-none"
                                onclick={() => changeStyle(styleObject)}
                                ref={(target) => {
                                    //  此时 DOM 未被挂载，所以需要使用这个方式
                                    setTimeout(() => {
                                        styleObject.ref = annotate(target, {
                                            type: styleObject.type,
                                            animate: true,
                                            color: color(),
                                        });
                                    });
                                }}>
                                {styleObject.type}
                            </span>
                        )}
                    </For>
                    <sl-color-picker
                        onpointerup={(el: any) => {
                            const color =
                                el.srcElement.getFormattedValue("hex");
                            // 修改颜色时直接修改上面的绘制颜色
                            setColor(color);
                            selectedStyle().ref!.color = color;
                        }}
                        format="hex"
                        value={initColor}></sl-color-picker>
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
