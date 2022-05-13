import { createSignal, lazy, Show, Suspense } from "solid-js";
import { Loading } from "../components/LoadingPage/loading";
import { ModuleDescription } from "../components/ModuleDescription";
import { loadScript, loadLink } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";

// ! 未完成

export const description: ModuleDescription = {
    title: "PyScript —— Python 运行器",
    desc: "PyScript 是运行在前端的 Python 环境",
    link: ["https://runkit.com/home"],
};

/** 加载 Runkit 脚本 */
// await loadScript("https://pyscript.net/alpha/pyscript.js");
await loadLink("https://pyscript.net/alpha/pyscript.css");
const pythonCode = `
print("Let's compute π:")
def compute_pi(n):
    pi = 2
    for i in range(1,n):
        pi *= 4 * i ** 2 / (4 * i ** 2 - 1)
    return pi

pi = compute_pi(100000)
s = f"π is approximately {pi:.3f}"
print(s)
   `;
export default function () {
    return (
        <div>
            {/* @ts-ignore */}
            {/* <py-env>- matplotlib</py-env> */}
            <div id="mpl"></div>
            {/* @ts-ignore */}
            <py-script output="mpl">{pythonCode}</py-script>
        </div>
    );
}
