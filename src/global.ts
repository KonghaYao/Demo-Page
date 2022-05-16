/** 配置 CDN 选项，如果使用 CDN 的话 */
export const isDev = () =>
    globalThis.location.host.split(":")[0] === "127.0.0.1";
export const CDN = isDev()
    ? globalThis.location.href
    : "https://cdn.jsdelivr.net/gh/konghayao/Demo-Page/index.html";
