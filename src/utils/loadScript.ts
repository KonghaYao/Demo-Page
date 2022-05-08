const successSet = new Set<string>();
export const loadScript = async (url: string) => {
    if (successSet.has(url)) return true;
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = () => {
            successSet.add(url);
            resolve(true);
        };
        script.onerror = (e) => {
            reject(e);
        };
        document.body.appendChild(script);
    });
};
export const loadLink = (url: string) => {
    if (successSet.has(url)) return true;
    return new Promise((resolve, reject) => {
        const script = document.createElement("link");
        script.href = url;
        script.rel = "stylesheet";
        script.onload = () => {
            successSet.add(url);
            resolve(true);
        };
        script.onerror = (e) => {
            reject(e);
        };
        document.head.appendChild(script);
    });
};
