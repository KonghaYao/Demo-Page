import { createSignal, For, onCleanup, onMount } from "solid-js";
import { NodeConfig, EdgeConfig } from "@antv/g6";
import { getIconForFile } from "vscode-icons-js";
import { ModuleEvents } from "./ModuleStore";
import {
    debounceTime,
    filter,
    from,
    fromEvent,
    map,
    of,
    Subscription,
    switchMap,
    tap,
    toArray,
} from "rxjs";
/** 渲染一行文件 */
const renderRow = (item: NodeConfig & { name: string }) => {
    return (
        <div class="flex items-center cursor-default button-like">
            <img
                class="h-4 w-4 mx-2"
                src={
                    "https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/" +
                    getIconForFile(item.name)
                }
            />
            {item.name as string}
        </div>
    );
};
export const RenderFileTree = (props: {
    data(): {
        nodes: (NodeConfig & { name: string })[];
        edges: EdgeConfig[];
    };
    update?: () => void;
}) => {
    let input: HTMLInputElement;
    const [searchRegExp, setSearchRegExp] = createSignal(null as RegExp | null);
    /** 筛选被搜索的node */
    const getFiltered = () => {
        const nodes = props.data().nodes;
        const edges = props.data().edges;
        const reg = searchRegExp()!;
        return from(nodes).pipe(
            filter((node) => {
                const isIn = reg.test(node.name);
                node.visible = isIn;
                return isIn;
            }),
            tap(({ id }) => {
                edges.forEach((edge) => {
                    edge.visible = edge.source === id || edge.source === id;
                });
            }),
            toArray()
        );
    };
    let updater$: Subscription;
    onMount(() => {
        updater$ = fromEvent(input, "input")
            .pipe(
                debounceTime(400),
                map((e) => (e.target as HTMLInputElement).value),
                switchMap((text) => {
                    if (text === "") {
                        return of(props.data().nodes).pipe(
                            tap((node) => {
                                node.forEach((i) => (i.visible = true));
                                props
                                    .data()
                                    .edges.forEach((i) => (i.visible = true));
                            })
                        );
                    } else {
                        return of(text).pipe(
                            tap((text) => {
                                setSearchRegExp(new RegExp(text));
                            }),
                            switchMap(getFiltered)
                        );
                    }
                })
            )
            .subscribe((fileList) => {
                setFileList(fileList);
                console.log(fileList);
                ModuleEvents.emit("filterUpdate", {});
            });
    });
    onCleanup(() => {
        updater$.unsubscribe();
    });
    const [fileList, setFileList] = createSignal(props.data().nodes);
    return (
        <div class="flex-none h-full overflow-hidden absolute z-10 flex flex-col backdrop-blur-lg bg-gray-100/60 px-2">
            <input type="search" placeholder="请输入正则表达式" ref={input!} />
            <div class="overflow-y-auto flex-grow">
                <For each={fileList()}>{renderRow}</For>
            </div>
        </div>
    );
};
