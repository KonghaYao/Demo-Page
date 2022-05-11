export const Loading = () => {
    return (
        <div className="h-full w-full flex-col flex justify-center items-center">
            {/* @ts-ignore */}
            <atom-spinner></atom-spinner>
            <span className="p-4">加载中。。。</span>
        </div>
    );
};
