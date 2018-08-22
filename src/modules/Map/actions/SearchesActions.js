import { yelp } from '../../../env/variables'

export function yelpRequest(query, term = '') {
	// return markers and query to decide in handler what to do with them
	console.log(this)
	return fetch(`${yelp.url}/${query}`)
		.then(res => res.json())
		.then(res => {
			const markers = res.businesses.map(business => {
				const { coordinates, name, phone } = business
				const { latitude, longitude } = coordinates
				const marker = {
					position: {lat: latitude, lng: longitude},
					name,
					term,
					phone
				}
				return this.newMarker(marker, false)
			})
			return {query, markers}
		})
		.catch(console.error)
}
