import { google } from '../../../env/variables'
import { newMarker } from './marker'
import { drawing, toggleDrawing, getDistance } from './map'
import { getCurrentPosition } from './geolocation'

function googleMapInit (config) {
	const {
		center = { lat: 51.5074, lng: -0.1269 },
		zoom = 12,
		styles = {},
		libraries = ['drawing', 'geometry'],
	} = config
	const script = document.createElement( 'script' );
	script.src = `https://maps.googleapis.com/maps/api/js?libraries=${libraries.toString()}&key=${google.APIKey}`;
	document.head.appendChild(script)
	script.onload = (e) => {
		getCurrentPosition()
			.then(position => {
				const map = new window.google.maps.Map(document.getElementById('map'), {
					center: position,
					zoom,
					styles,
				});
				const google = window.google
				// const drawingManager = drawing(google, this)
				// this.infoWindow = new google.maps.InfoWindow()
				this.map = map
				this.google = google
				// this.toggleDrawing = toggleDrawing
				// this.drawingManager = drawingManager

			})
	}
}

export default googleMapInit
