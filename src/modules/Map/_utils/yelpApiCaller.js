/**
 * This function calls Yelp API endpoint on Node server. It sends request through server becouse Yelp API does not permit to use their api on client side.
 * @param term - string to find
 * @param position
 * @param config
 * @return {Promise<any>}
 */
export function yelpTermRequest(term, position, config={}) {
	const { limit=25, offset=0 } = config
	return fetch(`/api/yelp/term=${term}&latitude=${position.lat}&longitude=${position.lng}&limit=${limit}&offset=${offset}`)
		.then(res => res.json())
		.then(res => res)
		.catch(console.error)
}
