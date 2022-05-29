import { Component, createSignal, mergeProps, onCleanup } from "solid-js";
import { getAssets } from "../../utils/getAssets";
const SpinnerNames: string[] = await getAssets(
    "./assets/spinnerName.json",
    "json"
);
const sample = (list: string[]) =>
    list[Math.floor(Math.random() * list.length)];
export const Loading: Component<{
    message?: string;
    spinner?: string;
}> = (props) => {
    props = mergeProps(
        {
            message: "加载中。。。",
            spinner: sample(SpinnerNames),
        },
        props
    );
    const el = document.createElement(props.spinner!);
    const [counter, setCounter] = createSignal(0);
    const tag = setTimeout(() => setCounter(counter() + 1), 1000);
    onCleanup(() => {
        clearTimeout(tag);
    });
    return (
        <div className="h-full w-full flex-col flex justify-center items-center">
            {el}
            <span className="p-4">
                已等候 {counter} 秒 - {props.message}
            </span>
        </div>
    );
};
