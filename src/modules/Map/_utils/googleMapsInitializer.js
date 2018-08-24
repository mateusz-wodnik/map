import { google } from '../../../env/variables'
import { newMarker, showMarker, hideMarker } from './marker'
import { drawing, toggleDrawing, getDistance } from './map'

function googleMapInit (config) {
	const {
		center = { lat: 51.5074, lng: -0.1269 },
		zoom = 13,
		styles = {},
	} = config
	const script = document.createElement( 'script' );
	script.src = `https://maps.googleapis.com/maps/api/js?libraries=drawing,geometry&key=${google.APIKey}`;
	document.head.appendChild(script)
	script.onload = (e) => {
		let a = ''
		const map = new window.google.maps.Map(document.getElementById('map'), {
			center,
			zoom,
			styles,
		});
		const google = window.google
		const drawingManager = drawing(google, this)
		// this.infoWindow = new google.maps.InfoWindow()
		this.map = map
		this.google = google
		this.newMarker = newMarker
		this.showMarker = showMarker
		this.hideMarker = hideMarker
		this.toggleDrawing = toggleDrawing
		this.drawingManager = drawingManager
		this.distanceMatrixService = new google.maps.DistanceMatrixService()
		// this.streetViewService = new google.maps.StreetViewService()
		this.getDistance = getDistance
	}
}

export default googleMapInit
