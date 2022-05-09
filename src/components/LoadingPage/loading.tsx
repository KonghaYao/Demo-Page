export const Loading = () => {
    return (
        <div class="h-full w-full flex-col flex justify-center items-center">
            {/* @ts-ignore */}
            <atom-spinner></atom-spinner>
            <span class="p-4">加载中。。。</span>
        </div>
    );
};
