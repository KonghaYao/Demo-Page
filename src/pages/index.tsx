import { createResource } from "solid-js";
import { Markdown } from "../utils/remark";
import "../style/markdown.css";

export const description = {
    title: "介绍文件",
};

export default function README() {
    const [markdownHTML, {}] = createResource(async () => {
        const file = await fetch("./README.md").then((res) => res.text());
        const mark = await Markdown.process(file);
        return mark.value as string;
    });
    return <div class="markdown-body" innerHTML={markdownHTML()}></div>;
}
