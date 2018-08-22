export function dictionaryToArray(dictionary) {
	const array = []
	Object.values(dictionary).map(cat => array.push(...cat))
	return array
}
