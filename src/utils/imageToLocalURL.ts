export const imageToLocalURL = (url: string) => {
    return fetch(url)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob));
};
