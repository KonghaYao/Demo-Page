import { loadScript } from "./loadScript";
import type Sodium from "libsodium-wrappers";
await loadScript(
    "https://fastly.jsdelivr.net/gh/jedisct1/libsodium.js/dist/browsers/sodium.js"
);
export const CHUNK_SIZE = 64 * 1024 * 1024;
export const crypto_secretstream_xchacha20poly1305_ABYTES = 17;
const sodium: typeof Sodium = (globalThis as any).sodium;
/** 获取 key 值，key 被加盐了，所以每次都是不同的 */
export const getKey = function (
    password: string,
    salt: Uint8Array = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES)
) {
    return [
        sodium.crypto_pwhash(
            sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES,
            password,
            salt,
            sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
            sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
            sodium.crypto_pwhash_ALG_ARGON2ID13
        ),
        salt,
    ];
};

export function headerEncode(header: Uint8Array) {
    return btoa(String.fromCharCode(...header));
}
export function headerDecode(header: string) {
    return new Uint8Array(
        atob(header)
            .split("")
            .map((i) => i.charCodeAt(0))
    );
}
export function Encryption(keyString: string, FileUint8Array: Uint8Array) {
    const [key, salt] = getKey(keyString);
    let { header, state } =
        sodium.crypto_secretstream_xchacha20poly1305_init_push(key);
    const last = true;
    let tag = last
        ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
        : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;

    let encryptedChunk = sodium.crypto_secretstream_xchacha20poly1305_push(
        state,
        FileUint8Array,
        null,
        tag
    );

    return new Uint8Array([
        ...new Uint8Array(11),
        ...salt,
        ...header,
        ...encryptedChunk,
    ]);
}
export function Decryption(key: string, file: Uint8Array) {
    const [signature, salt, header, chunk] = [
        file.slice(0, 11), //signature
        file.slice(11, 27), //salt
        file.slice(27, 51), //header
        file.subarray(
            51,
            51 + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES
        ), //17
    ];
    const [password] = getKey(key, salt);
    let state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(
        header,
        password
    );

    let result = sodium.crypto_secretstream_xchacha20poly1305_pull(
        state,
        chunk
    );

    if (result) {
        return result.message;
    }
}
