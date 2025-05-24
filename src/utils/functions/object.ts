export function groupBy(list: any[], prop: string) {
	return list.reduce((grouped, item: any) => {
		const key = item[prop]
		delete item[prop]
		if (Object.prototype.hasOwnProperty.call(grouped, key)) {
			grouped[key].push(item)
		} else {
			grouped[key] = [item]
		}

		return grouped
	}, {})
}