import { createResource, onMount } from "solid-js";
import { Markdown } from "../utils/remark";
import "../style/markdown.css";
export default function README() {
    const [markdownHTML, {}] = createResource(async () => {
        const file = await fetch("./README.md").then((res) => res.text());

        return (await Markdown.process(file)).value;
    });
    return <div class="markdown-body" innerHTML={markdownHTML()}></div>;
}
