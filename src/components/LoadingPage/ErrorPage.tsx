export const ErrorPage = (props: {
    err: Error
    reload: () => void
}) => {
    let reload = props.reload || (() => window.location.reload())
    return (
        <div class="h-full w-full flex-col flex justify-center items-center text-red-400 font-bold">
            {/* @ts-ignore */}
            <span class="p-4">发生了不知名的错误, 错误如下</span>
            <span class="text-xs">{props.err.message}</span>
            <button class="button-like px-4 py-2 m-2 bg-green-400 text-white" onclick={reload}>点击重试</button>
        </div>
    );
};
