/**
 * This function gets actual position of client with HTML5 geolocation API. It returns promise and handles errors.
 * @return {Promise<any>}
 */
export function getCurrentPosition() {
	return new Promise((resolve, reject) => {
		if("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(position => {
				resolve({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				})
			}, () => reject("HTM5 geolocator couldn't find yout location"))
		} else {
			reject('HTML5 geolocation is not available')
		}
	})
}
