import { Evaluator } from "rollup-web";

const Eval = new Evaluator();
await Eval.useWorker("./js/bundle_worker.js");
console.log(Eval);
await Eval.createEnv({});

// 开始执行打包操作
console.time("初次打包时间");
const result = await Eval.evaluate("./src/index.tsx");
console.timeEnd("初次打包时间");
// 去除等候页面
globalThis.PrepareDestroy();
console.log(result);

import { cache } from "rollup-web/dist/plugins/drawDependence.js";
globalThis.MapperStore = cache;
