import { createMemo, createSignal, For } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import { GH, NPM } from "../global";
export const description: ModuleDescription = {
    fileName: "model-viewer",
    title: "3D 模型查看器",
    desc: "Google 开源的 glTF 模型查看器",
    link: [
        "https://modelviewer.dev/",
        "https://github.com/google/model-viewer",
    ],
};
await Promise.all([
    import(NPM + "@google/model-viewer/dist/model-viewer.min.js"),
]);
const ModelList = [
    ["Canoe", "packages/modelviewer.dev/assets/ShopifyModels/Canoe.glb"],
    ["Chair", "packages/modelviewer.dev/assets/ShopifyModels/Chair.glb"],
    [
        "GeoPlanter",
        "packages/modelviewer.dev/assets/ShopifyModels/GeoPlanter.glb",
    ],
    ["Mixer", "packages/modelviewer.dev/assets/ShopifyModels/Mixer.glb"],
    ["ToyTrain", "packages/modelviewer.dev/assets/ShopifyModels/ToyTrain.glb"],
].map(([key, i]) => [key, GH + "google/model-viewer/" + i]);

export default function () {
    const [selectModel, changeModel] = createSignal("Chair");
    const selectURL = createMemo(() => {
        return (ModelList.find((i) => i[0] === selectModel()) ||
            ModelList[0])[1];
    });
    return (
        <div class="h-full w-full flex flex-col">
            <div>
                <select>
                    <For each={ModelList}>
                        {([key, value]) => <option value={value}>{key}</option>}
                    </For>
                </select>
            </div>
            <model-viewer
                class="h-full w-full"
                src={selectURL()}
                ar
                ar-modes="webxr scene-viewer quick-look"
                shadow-intensity="1"
                camera-controls
                enable-pan></model-viewer>
        </div>
    );
}
