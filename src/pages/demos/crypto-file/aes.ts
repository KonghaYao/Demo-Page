import * as aes from "aes-js";
import {Sha256} from '@aws-crypto/sha256-js';

const sha256 = (buffer:string|ArrayBuffer)=>{
    const hash = new Sha256();
    hash.update(buffer);
    return  hash.digest();
}

/** 加密文件 */
export default  async (
    /** 文件内容，必须为二进制类型，node 使用 Buffer，浏览器使用 ArrayBuffer 或者其他 Buffer 都行 */
    buffer: Buffer | ArrayBuffer | Uint8Array,
    /** key 为任意长度的字符串 */
    key: string,
    /** true 为加密，false 为解密 */
    encrypt: boolean
) => {
    if (!(buffer instanceof Uint8Array)) {
        buffer = new Uint8Array(buffer);
    }
    const ArrayKey = await sha256(key);
    const aesCtr = new aes.ModeOfOperation.ctr(ArrayKey);
    return aesCtr[encrypt ? "encrypt" : "decrypt"](buffer);
};