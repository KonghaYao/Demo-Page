const timeMap = new Map<string, number>();
export const timeCounter = (tag: string) => {
    let stored = timeMap.get(tag);
    if (stored) {
        const result = Date.now() - stored;
        timeMap.delete(tag);
        return result;
    } else {
        timeMap.set(tag, Date.now());
        return null;
    }
};
