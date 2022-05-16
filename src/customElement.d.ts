import Solid from "solid-js";
declare module "solid-js" {
    export namespace JSX {
        // 下列是自定义的 Web Component
        export interface IntrinsicElements {
            "sl-textarea": any;
            "sl-tag": any;
            "sl-input": any;
            "xy-tips": any;
            "xy-input": any;
            "atom-spinner": any;
            "sl-image-comparer": any;
            "sl-format-bytes": any;
        }
    }
}
