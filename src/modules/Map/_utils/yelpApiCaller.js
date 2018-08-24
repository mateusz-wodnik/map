export function yelpTermRequest(term, position) {
	return fetch(`/api/yelp/term=${term}&latitude=${position.lat}&longitude=${position.lng}&limit=25`)
		.then(res => res.json())
		.then(res => res)
		.catch(console.error)
}
