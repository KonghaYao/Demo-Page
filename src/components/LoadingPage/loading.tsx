import { Component, mergeProps } from "solid-js";
import SpinnerNames from "../../../assets/spinnerName.json";
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
    return (
        <div className="h-full w-full flex-col flex justify-center items-center">
            {el}
            <span className="p-4">{props.message}</span>
        </div>
    );
};
