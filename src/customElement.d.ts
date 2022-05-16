import Solid from "solid-js";
declare module "solid-js" {
    export namespace JSX {
        export interface IntrinsicElements {
            "sl-textarea": any;
            "sl-tag": any;
            "sl-input": any;
        }
    }
}
