/**
 * This function provides Distance Matrix Service in easly maintainable way using Promises.
 * @param config
 * @return {Promise<any>}
 */
export function getDistance (config = {}) {
	const { google } = window
	const distanceMatrixService = new google.maps.DistanceMatrixService()
	const {
		origins = ['Washington,DC'],
		destinations = ['New+York+City,NY'],
		travelMode = 'BICYCLING',
		unitSystem = 'IMPERIAL',
	} = config

	return new Promise((resolve, reject) => {
		distanceMatrixService.getDistanceMatrix({
			origins,
			destinations,
			travelMode: google.maps.TravelMode[travelMode],
			unitSystem: google.maps.UnitSystem[unitSystem],
		}, (data, status) => {
			if(status !== google.maps.DistanceMatrixStatus.OK) reject('Something went wrong with getDistanceMatrix request')
			resolve(data)
		})
	})
}
