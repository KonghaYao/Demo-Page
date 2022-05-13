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
const router = new Navigo("/", { hash: true });
type ElementCreator = (cb?: Match) => JSX.Element;

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
    const isNow = !!router.matchLocation(props.path);
    const [matched, setMatched] = createSignal(isNow);
    const [matchedData, setData] = createSignal<Match | undefined>(undefined);
    const cb = (info?: Match) => {};
    router.on(props.path, cb, {
        before(done, match) {
            batch(() => {
                setMatched(true);
                setData(match);
            });
            done();
        },
        leave(done, match) {
            batch(() => {
                setMatched(false);
                setData(undefined);
            });
            done();
        },
    });

    onCleanup(() => {
        router.off(cb);
    });
    return (
        <Show when={matched()}>
            <Suspense fallback={<p>Loading...</p>}>
                {typeof props.element === "function"
                    ? props.element(matchedData())
                    : props.element}
            </Suspense>
        </Show>
    );
};
