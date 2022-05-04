// 当用户返回的时候刷新页面
document.addEventListener("visibilitychange", function () {
    console.log(document.visibilityState);
    if (document.visibilityState === "visible") {
        globalThis.location.reload();
    }
});
