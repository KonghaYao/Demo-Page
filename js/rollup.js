import { Evaluator, createWorker } from "rollup-web/dist/index.js";
import { wrap } from "https://fastly.jsdelivr.net/npm/comlink/dist/esm/comlink.mjs";

// 需要使用这种方式等候 线程结束初始化
const worker = await createWorker("./js/bundle_worker.js", {
    type: "module",
});
const compiler = wrap(worker);
const Eval = new Evaluator();
console.log(Eval, compiler);
await Eval.createEnv({
    Compiler: compiler,
});

// 开始执行打包操作
console.time("初次打包时间");
const result = await Eval.evaluate("./src/index.tsx");
console.timeEnd("初次打包时间");
// 去除等候页面
globalThis.PrepareDestroy();
console.log(result);
