export function dictionaryToArray(dictionary) {
	const array = []
	Object.values(dictionary).map(item => array.push(...item))
	return array
}

export function arrayToDictionary(array, key) {
	const dictionary = {}
	array.forEach(item => {
		dictionary[item[key]] ? dictionary[item[key]].push(item) : dictionary[item[key]] = [item]
	})
	return dictionary
}

