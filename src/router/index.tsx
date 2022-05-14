import {
    batch,
    Component,
    createMemo,
    createSignal,
    onCleanup,
    onMount,
    Show,
    Suspense,
} from "solid-js";
import Navigo, { Match } from "navigo";
import { JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
export const router = new Navigo("/", {
    hash: true,
});

/** 路由跳转组件 */
export const Link = (props: { href: string; element: JSX.Element }) => {
    const jumpTo = () => {
        router.navigate(props.href);
    };
    return (
        <a onclick={jumpTo}>
            <Suspense fallback={<p>Loading...</p>}>{props.element}</Suspense>
        </a>
    );
};

/** 路由显示组件 */
export const Route = (props: { path: string; element: Component<any> }) => {
    const isCurrent = router.matchLocation(props.path);
    const [matched, setMatched] = createSignal(isCurrent);
    const cb = (info?: Match) => {};
    router.on(props.path, cb, {
        before(done, match) {
            setMatched(match);
            console.log("路由跳转 => ", match.url);
            done();
        },
        leave(done, match) {
            setMatched(false);
            done();
        },
    });

    onCleanup(() => {
        router.off(cb);
    });
    const component = createMemo(() => {
        if (matched()) {
            return props.element;
        } else {
            return () => <div>loading</div>;
        }
    });
    return (
        <Show when={!!matched()}>
            <Dynamic
                component={component()}
                someProp={() => ({
                    match: matched(),
                })}></Dynamic>
        </Show>
    );
};
