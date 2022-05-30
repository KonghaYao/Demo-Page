import { ModuleDescription } from "../components/ModuleDescription";
import { wrap } from "comlink";
import { CDN } from "../global";
import {
    Component,
    createResource,
    createSignal,
    For,
    lazy,
    Match,
    Suspense,
    Switch,
} from "solid-js";
import { Loading } from "../components/LoadingPage/loading";
export const description: ModuleDescription = {
    fileName: "pyodide",
    title: "pyodide —— 浏览器 Python 环境",
    desc: "在浏览器上运行 Python 的插件",
    link: [
        "https://pyodide.org/en/stable/usage/loading-packages.html",
        "https://github.com/pyodide/pyodide",
    ],
};

// 注册一个 CDN， 这个 CDN 可以通过 JSDelivr 获取！
const worker = new Worker(new URL("./src/utils/pyodide.js", CDN));
const api = wrap<any>(worker);

export default function () {
    const [message, setMsg] = createSignal("加载中");
    const Async = lazy(async () => {
        // 预先加载 pyodide
        setMsg("初始化 pyodide 中，需要下载包较大，请稍等");
        await api.init();
        setMsg("加载 npmpy 插件包，请稍等");
        await api.loadPackage("numpy");
        return { default: Main };
    });
    return (
        <Suspense fallback={<Loading message={message()}></Loading>}>
            <Async></Async>
        </Suspense>
    );
}
const Main = () => {
    return (
        <div>
            <PackagesList></PackagesList>
            <Repl></Repl>
        </div>
    );
};
import { format } from "pretty-format";
await import("@shoelace-style/shoelace/dist/components/textarea/textarea.js");
const Repl: Component<{}> = (props) => {
    let code = `
import numpy as np
def make_x_and_y(n):
    x = np.random.randn(n)
    y = np.random.randn(n)
    return x, y
x, y = make_x_and_y(n=10)
x, y
`;
    const [result, { refetch }] = createResource("", async () => {
        return api.eval(code);
    });
    return (
        <div>
            <sl-textarea
                placeholder="请输入 Python 代码！"
                value={code}
                on:sl-change={(e: InputEvent) => {
                    code = (e.currentTarget as HTMLTextAreaElement).value;
                    refetch();
                }}></sl-textarea>

            <Switch fallback={<div>{format(result())}</div>}>
                <Match when={result.loading}>loading...</Match>
                <Match when={result.error}>{result.error}</Match>
            </Switch>
        </div>
    );
};

await import("@shoelace-style/shoelace/dist/components/tag/tag.js");
await import("@shoelace-style/shoelace/dist/components/input/input.js");
import { Notify } from "notiflix";
/* 模块查看器 */
const PackagesList: Component<{}> = (props) => {
    const [packages, { refetch }] = createResource([], async () => {
        const packs = await api.loadedPackages();
        return Object.entries(packs) as [string, string][];
    });
    enum State {
        idle,
        loading,
        input,
    }
    const [state, setState] = createSignal<State>(State.idle);
    const loadPackage = async (packageName: string) => {
        setState(State.loading);
        Notify.info("加载包 " + packageName);
        await api.loadPackage(packageName);
        await refetch();
        setState(State.idle);
    };

    return (
        <div class="flex flex-wrap">
            <For each={packages()}>
                {([name, position]) => <sl-tag class="m-2">{name}</sl-tag>}
            </For>
            <Switch>
                <Match when={state() === State.idle}>
                    <sl-tag class="m-2" onclick={() => setState(State.input)}>
                        +
                    </sl-tag>
                </Match>
                <Match when={state() === State.input}>
                    <sl-input
                        placeholder="输入需要加载的包名"
                        on:sl-change={(e: InputEvent) =>
                            loadPackage(
                                (e.currentTarget as HTMLInputElement).value
                            )
                        }></sl-input>
                </Match>
                <Match when={state() === State.loading}>
                    <sl-tag class="m-2">
                        <Loading></Loading>
                    </sl-tag>
                </Match>
            </Switch>
        </div>
    );
};
