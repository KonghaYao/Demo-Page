import { Evaluator } from "https://fastly.jsdelivr.net/npm/rollup-web@4.6.7/dist/index.js";

const Eval = new Evaluator();
console.time("构建Worker时间");
await Eval.useWorker("./js/bundle_worker.js");
console.timeEnd("构建Worker时间");
console.log(Eval);
await Eval.createEnv({});

// 开始执行打包操作
console.time("初次打包时间");
const result = await Eval.evaluate("./src/index.tsx");
console.timeEnd("初次打包时间");

// 去除等候页面
globalThis.PrepareDestroy();
console.log(result);

import { cache } from "https://fastly.jsdelivr.net/npm/rollup-web@4.6.7/dist/plugins/drawDependence.js";
globalThis.MapperStore = cache;
