import {
    batch,
    createSignal,
    onCleanup,
    onMount,
    Show,
    Suspense,
} from "solid-js";
import Navigo, { Match } from "navigo";
import { JSX } from "solid-js";
export const router = new Navigo("/", {
    hash: true,
});
type ElementCreator = (cb: Match | false) => JSX.Element;

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
export const Route = (props: {
    path: string;
    element: JSX.Element | ElementCreator;
}) => {
    const isCurrent = router.matchLocation(props.path);
    const [matched, setMatched] = createSignal(isCurrent);
    const cb = (info?: Match) => {};
    router.on(props.path, cb, {
        before(done, match) {
            batch(() => {
                setMatched(match);
            });
            console.log(match);
            done();
        },
        leave(done, match) {
            batch(() => {
                setMatched(false);
            });
            done();
        },
    });

    onCleanup(() => {
        router.off(cb);
    });
    return (
        <Show when={matched()}>
            {matched() &&
                (typeof props.element === "function"
                    ? props.element(matched())
                    : props.element)}
        </Show>
    );
};
