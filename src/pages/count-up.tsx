import { createSignal, onMount } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import { CountUp } from "countup.js";
export const description: ModuleDescription = {
    fileName: "count-up",
    title: "countUp.js 数字滚动库",
    desc: "实现数字滚动的无依赖库",
    link: [
        "https://github.com/inorganik/CountUp.js#usage",
        "https://inorganik.github.io/countUp.js/",
    ],
};

export default function () {
    let el: HTMLDivElement;
    let control: CountUp;
    onMount(() => {
        control = new CountUp(el, parseInt(el.textContent!), {});
        control.start(() => setEditable(true));
        setEditable(false);
    });
    const [editable, setEditable] = createSignal(true);
    const buttonClass = "bg-white rounded-lg px-4 py-2 hover:brightness-90";
    return (
        <div class="flex flex-col justify-center items-center h-full w-full">
            <div
                class="text-4xl text-gray-700 p-4"
                ref={el!}
                contenteditable={editable()}
                onBlur={(e) => {
                    const result = parseInt(e.currentTarget.textContent!);
                    console.log(result);
                    !isNaN(result) && control.update(result);
                }}>
                73830
            </div>
            <div class="grid grid-cols-3 gap-4">
                <button
                    class={buttonClass}
                    onclick={() => {
                        setEditable(false);
                        control.start(() => setEditable(true));
                    }}>
                    开始
                </button>
                <button
                    class={buttonClass}
                    onclick={() => {
                        control.reset();
                        setEditable(true);
                    }}>
                    重置
                </button>
                <button
                    class={buttonClass}
                    onclick={() => {
                        control.pauseResume();
                        setEditable(true);
                    }}>
                    暂停或开始
                </button>
            </div>
        </div>
    );
}
