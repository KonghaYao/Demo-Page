import { imageToLocalURL } from "./imageToLocalURL"

/** 获取图像的像素点阵，只获取一次 */
export function imageToArray(url: string) {
    return new Promise<[HTMLImageElement, Uint8ClampedArray]>(
        async (resolve) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d")!;
            let image = new Image();

            const Url = await imageToLocalURL(url);
            image.src = Url;
            image.onload = () => {
                canvas.height = image.height;
                canvas.width = image.width;
                ctx.drawImage(image, 0, 0, image.width, image.height);

                resolve([
                    image,
                    ctx.getImageData(0, 0, image.width, image.height).data,
                ]);
            };
        }
    );
}
