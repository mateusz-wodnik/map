export function newMarker (data, showStreetView) {
	const { position, name } = data
	const marker = new this.google.maps.Marker({
		position,
		title: name,
		animation: this.google.maps.Animation.DROP,
	})
	marker.addListener('click', () => {
		if(showStreetView) {
			streetView(marker, this)
		} else {
			this.infoWindow.setContent(
				`<div>
						<h2>${marker.title}</h2>
					</div>`
			)
		}
		this.infoWindow.open(this.map, marker)
	})
	return marker
}

export function showMarker(name) {
	const bounds = new this.google.maps.LatLngBounds()
	const markers = this.state.markers[name].map(marker => {
		marker.setMap(this.map)
		bounds.extend(marker.position)
		return marker
	})
	this.setState({markers: {...this.state.markers, [name]: markers}})
	this.map.fitBounds(bounds)
}

export function hideMarker() {
	const markers = this.state.markers.map(marker => {
		marker.setMap(null)
		return marker
	})
	this.setState({markers})
}

export const streetView = (marker, env) => {
	const maps = env.google.maps
	const streetViewService = new maps.StreetViewService()
	const radius = 50

	const getStreetView = (data, status) => {
		if(status === maps.StreetViewStatus.OK) {
			const nearStreetViewLocation = data.location.latLng;
			const heading = maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position)
			env.infoWindow.setContent(
				`<div>
						<h2>${marker.title}</h2>
						<div style="width: 300px; height: 300px" id="pano"></div>
					</div>`
			)
			const panoramaOptions = {
				position: nearStreetViewLocation,
				pov: {
					heading,
					pitch: 30,
				}
			}
			const panorama = new maps.StreetViewPanorama(document.querySelector('#pano'), panoramaOptions)
		} else {
			env.infoWindow.setContent(
				`<div>
						<h2>${marker.title}</h2>
						<p>No Street View Found</p>
					</div>`
			)
		}
	}
	streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView)
}
