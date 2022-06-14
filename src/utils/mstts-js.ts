import { v4 as uuidv4 } from "uuid";
async function getAuthToken() {
    //https://azure.microsoft.com/en-gb/services/cognitive-services/text-to-speech/
    // token 嵌入到 网页中了
}

function getXTime() {
    return new Date().toISOString();
}

function wssConnect(url: string) {
    return new Promise<WebSocket>((resolve, reject) => {
        var ws = new WebSocket(url);
        ws.onopen = function (evt) {
            console.log("Connection open ...");
            resolve(ws);
        };
        ws.onerror = (e) => {
            reject(e);
        };
    });
}
import { Buffer } from "buffer";
export async function getTTSData(
    text: string,
    token: string,
    voice = "CN-Yunxi",
    express = "general",
    role = "",
    rate = 0,
    pitch = 0
) {
    if (!express) express = "general";
    const SSML = `
    <speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
        <voice name="zh-${voice}Neural">
            <mstts:express-as style="${express}" ${
        role != "" ? 'role="' + role + '"' : ""
    }>
                <prosody rate="${rate}%" pitch="${pitch}%">
                ${text}
                </prosody>
            </mstts:express-as>
        </voice>
    </speak>
    `;

    const Authorization = token || (await getAuthToken());
    const XConnectionId = uuidv4().toUpperCase();

    console.log("创建webscoket连接...");
    const connect = await wssConnect(
        `wss://eastus.tts.speech.microsoft.com/cognitiveservices/websocket/v1?Authorization=${Authorization}&X-ConnectionId=${XConnectionId}`
    );

    const message_1 = `Path: speech.config\r\nX-RequestId: ${XConnectionId}\r\nX-Timestamp: ${getXTime()}\r\nContent-Type: application/json\r\n\r\n{"context":{"system":{"name":"SpeechSDK","version":"1.19.0","build":"JavaScript","lang":"JavaScript","os":{"platform":"Browser/Linux x86_64","name":"Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0","version":"5.0 (X11)"}}}}`;
    connect.send(message_1);

    const message_2 = `Path: synthesis.context\r\nX-RequestId: ${XConnectionId}\r\nX-Timestamp: ${getXTime()}\r\nContent-Type: application/json\r\n\r\n{"synthesis":{"audio":{"metadataOptions":{"sentenceBoundaryEnabled":false,"wordBoundaryEnabled":false},"outputFormat":"audio-24khz-160kbitrate-mono-mp3"}}}`;
    connect.send(message_2);

    const message_3 = `Path: ssml\r\nX-RequestId: ${XConnectionId}\r\nX-Timestamp: ${getXTime()}\r\nContent-Type: application/ssml+xml\r\n\r\n${SSML}`;
    connect.send(message_3);

    return new Promise<Blob>((resolve, reject) => {
        const blobs: ArrayBuffer[] = [];
        let count = 0;
        connect.addEventListener("message", (e) => {
            if (
                typeof e.data === "string" &&
                e.data.indexOf("Path:turn.end") >= 0
            ) {
                console.log("已完成");
                connect.close();
                resolve(new Blob(blobs));
            }
        });
        connect.addEventListener("message", async function (response) {
            if (response.data instanceof Blob) {
                console.log("正在接收数据...");
                let temp = count++;
                const data = await Buffer.from(
                    await response.data.arrayBuffer()
                );
                const text = data.toString();
                const index = text.indexOf("Path:audio") + 12;
                const cmbData = data.slice(index);
                const buffer = Buffer.from(cmbData).buffer;
                blobs[temp] = buffer;
            }
        });
    });
}

const voices = {
    CN: {
        晓晓: "Xiaoxiao",
        晓辰: "Xiaochen",
        晓涵: "Xiaohan",
        晓墨: "Xiaomo",
        晓秋: "Xiaoqiu",
        晓睿: "Xiaorui",
        晓双: "Xiaoshuang",
        晓萱: "Xiaoxuan",
        晓颜: "Xiaoyan",
        晓悠: "Xiaoyou",
        云扬: "Yunyang",
        云希: "Yunxi",
        云野: "Yunye",
        辽宁晓北: "LN-Xiaobei",
        四川云希: "SC-Yunxi",
        云皓: "Yunhao",
        云健: "Yunjian",
    },
    TW: {
        曉臻: "HsiaoChen",
        曉雨: "HsiaoYu",
        雲哲: "YunJhe",
    },
    HK: {
        曉曼: "HiuMaan",
        曉佳: "HiuGaai",
        雲龍: "WanLung",
    },
};
