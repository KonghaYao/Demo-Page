declare global {
    namespace JSX {
        interface IntrinsicElements {
            // 扩展 IntrinsicElements 否则无法识别自定义标签
            "sl-textarea": any;
            "sl-tag": any;
            "sl-input": any;
        }
    }
}
