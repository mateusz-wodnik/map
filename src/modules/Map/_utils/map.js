/**
 * Drawing polygons initializer
 * @param google
 * @param env
 * @return {*}
 */

export function drawing(google, env) {
	const maps = google.maps
	const drawingManager = new maps.drawing.DrawingManager({
		drawingMode: maps.drawing.OverlayType.POLYGON,
		drawingControl: true,
		drawingControlOptions: {
			position: maps.ControlPosition.TOP_LEFT,
			drawingModes: [
				maps.drawing.OverlayType.POLYGON
			]
		}
	})

	drawingManager.addListener('overlaycomplete', (e) => {
		if(env.state.polygon) {
			env.state.polygon.setMap(null)
			env.hideMarker()
		}

		drawingManager.setDrawingMode(null)
		const polygon = e.overlay
		polygon.setEditable(true)

		env.setState({polygon})
		console.log('elo')

		searchWithinPolygon(env)

		polygon.getPath().addListener('set_at', () => searchWithinPolygon(env))
		polygon.getPath().addListener('insert_at', () => searchWithinPolygon(env))
	})

	return drawingManager
}

export const searchWithinPolygon = (env) => {
	env.state.markers.forEach(marker => {
		if(env.google.maps.geometry.poly.containsLocation(marker.position, env.state.polygon)) {
			marker.setMap(env.map)
		} else {
			marker.setMap(null)
		}
	})
}

export function toggleDrawing (manager) {
	console.log('elo')
	if(manager.map) {
		manager.setMap(null)
		if(this.state.polygon) this.state.polygon.setMap(null)
	} else {
		manager.setMap(this.map)
	}
}

/*******************************************************************************/

/**
 * Distance Matrix
 */

export function getDistance(config = {}, callback) {
	const {
		origins = ['Washington,DC'],
		destinations = ['New+York+City,NY'],
		mode = 'BICYCLING',
		avoid = 'highways',
	} = config
	this.distanceMatrixService.getDistanceMatrix({
		origins,
		destinations,
		travelMode: this.google.maps.TravelMode[mode],
		unitSystem: this.google.maps.UnitSystem.IMPERIAL
	}, (data, status) => {
		console.log(status)
		if(status !== this.google.maps.DistanceMatrixStatus.OK) return
		const distance = {
			text: data.rows[0].elements[0].distance.text,
			duration: data.rows[0].elements[0].duration.text
		}
		if(callback) return callback(data)
		this.setState({ distance })
	})
}
