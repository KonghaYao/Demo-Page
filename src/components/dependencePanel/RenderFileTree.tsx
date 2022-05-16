import { createSignal, For, onCleanup, onMount } from "solid-js";
import { NodeConfig, GraphData } from "@antv/g6";
import { ModuleEvents, ModuleStore, updateStore } from "./ModuleStore";
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
import { CodeViewerEvent } from "../../CodeViewer/store";
/** 渲染一行文件 */
const renderRow = (item: NodeConfig) => {
    const openFile = () => {
        CodeViewerEvent.emit("showCode", item.name as string);
    };
    return (
        <div
            className="flex items-center cursor-default button-like"
            onclick={openFile}>
            <img className="h-4 w-4 mx-2" src={item.icon!.img!} />
            {item.name as string}
        </div>
    );
};
export const RenderFileTree = () => {
    const data = ModuleStore.dependence.mapper! as GraphData;
    let input: HTMLInputElement;
    const [searchRegExp, setSearchRegExp] = createSignal(null as RegExp | null);
    /** 筛选被搜索的node */
    const getFiltered = () => {
        const nodes = data.nodes!;
        const edges = data.edges!;
        const reg = searchRegExp()!;
        return from(nodes).pipe(
            filter((node) => {
                const isIn = reg.test(node.name as string);
                node.visible = isIn;
                return isIn;
            }),
            toArray(),
            // 处理边的问题
            tap((filteredNode) => {
                const ids = filteredNode.map((i) => i.id);
                edges.forEach((i) => {
                    i.visible =
                        ids.includes(i.source!) && ids.includes(i.target!);
                });
            })
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
                        return of(data.nodes!).pipe(
                            tap((node) => {
                                node.forEach((i) => (i.visible = true));
                                data.edges!.forEach((i) => (i.visible = true));
                                updateStore("dependence", "filter", "");
                            })
                        );
                    } else {
                        return of(text).pipe(
                            tap((text) => {
                                setSearchRegExp(new RegExp(text));
                                updateStore("dependence", "filter", text);
                            }),
                            switchMap(getFiltered)
                        );
                    }
                })
            )
            .subscribe((fileList) => {
                setFileList(fileList);
                ModuleEvents.emit("filterUpdate", {});
            });
    });

    onCleanup(() => {
        updater$.unsubscribe();
    });

    const [fileList, setFileList] = createSignal(data.nodes!);

    return (
        <div className="flex-none h-full overflow-hidden absolute z-10 flex flex-col backdrop-blur-lg bg-gray-100/60 px-2">
            <input
                type="search"
                value={ModuleStore.dependence.filter}
                placeholder="请输入正则表达式"
                ref={input!}
            />
            <div className="overflow-y-auto flex-grow">
                <For each={fileList()}>{renderRow}</For>
            </div>
        </div>
    );
};
