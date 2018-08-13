import { google } from '../../../env/variables'
import { newMarker, showMarker, hideMarker } from './marker'
import { drawing, toggleDrawing } from './map'

function googleMapInit (config) {
	const {
		center = { lat: 40.7413549, lng: -73.9980244 },
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
		this.infoWindow = new window.google.maps.InfoWindow()
		this.map = map
		this.google = google
		this.newMarker = newMarker
		this.showMarker = showMarker
		this.hideMarker = hideMarker
		this.toggleDrawing = toggleDrawing
		this.drawingManager = drawingManager
	}
}

export default googleMapInit
