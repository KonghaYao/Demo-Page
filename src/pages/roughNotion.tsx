import {
    Component,
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
import { Portal } from "solid-js/web";
import { createStore } from "solid-js/store";
export default function () {
    const [selectedStyle, setSelectedStyle] = createSignal(styles[0]);
    const [color, setColor] = createSignal(initColor);

    /* 交换选择的固定样式 */
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
    let highlighter: Highlighter;
    const highlightMap = new Map<string, RoughAnnotation[]>();
    onMount(() => {
        highlighter = new Highlighter({
            $root: container,
            exceptSelectors: ["pre", "code"],
            verbose: true,
            style: {
                className: "tagging",
            },
        });
        highlighter
            .on("selection:hover", ({ id }, _, e) => {
                const positionContainer =
                    e instanceof MouseEvent ? e : e.touches[0];
                const { clientX: x, clientY: y } = positionContainer;
                setToolTipStyle({
                    left: x + "px",
                    top: y + "px",
                    display: "block",
                    id,
                });
            })
            .on("selection:hover-out", ({ id }, _, e) => {
                setToolTipStyle({
                    display: "none",
                });
            })
            .on("selection:create", ({ sources }) => {
                sources
                    .map((i) => ({
                        id: i.id,
                        dom: highlighter.getDoms(i.id),
                    }))
                    .flat()
                    .forEach(({ id, dom }) => {
                        const anos = dom.map((i) => {
                            const ano = annotate(i, {
                                type: selectedStyle().type,
                                animate: true,
                                color: color(),
                            });
                            ano.show();
                            return ano;
                        });
                        highlightMap.set(id, anos);
                    });
            })
            .on("selection:remove", ({ ids }) => {
                ids.forEach((i) => {
                    const anos = highlightMap.get(i)!;
                    anos.forEach((i) => {
                        i.hide();
                        setTimeout(() => {
                            i.remove();
                        }, i.animationDuration);
                    });
                    highlightMap.delete(i);
                });
            });
        highlighter.run();
        styles.find((i) => i === selectedStyle())!.ref!.show();
    });
    const [toolTipStyle, setToolTipStyle] = createStore({
        top: "0px",
        left: "0px",
        display: "none",
        id: "",
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
            <ToolTips
                toolTipStyle={toolTipStyle}
                onRemove={() => {
                    if (toolTipStyle.display !== "none" && toolTipStyle.id) {
                        highlighter.remove(toolTipStyle.id);
                        setToolTipStyle({
                            display: "none",
                            id: "",
                        });
                    }
                }}></ToolTips>
        </div>
    );
}
const ToolTips: Component<{
    toolTipStyle: {
        display: string;
        top: string;
        left: string;
    };
    onRemove: Function;
}> = (props) => {
    return (
        <Portal mount={document.body}>
            <div
                class="fixed flex bg-white px-4 py-2 rounded-lg"
                style={props.toolTipStyle}>
                <div
                    class="material-icons hover:bg-gray-100 p-1 rounded-lg"
                    onclick={() => props.onRemove()}>
                    close
                </div>
                <div class="material-icons">close</div>
            </div>
        </Portal>
    );
};
