export const groupBy = (list: any[], prop: string) => {
    return list.reduce((grouped, item: any) => {
        const key = item[prop];
        delete item[prop];
        if (grouped.hasOwnProperty(key)) {
            grouped[key].push(item);
        } else {
            grouped[key] = [item];
        }
        return grouped;
    }, {});
}