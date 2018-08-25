export function yelpTermRequest(term, position, config={}) {
	const { limit=25, offset=0 } = config
	return fetch(`/api/yelp/term=${term}&latitude=${position.lat}&longitude=${position.lng}&limit=${limit}&offset=${offset}`)
		.then(res => res.json())
		.then(res => res)
		.catch(console.error)
}
