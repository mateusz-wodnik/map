import {dictionaryToArray} from './dictionaryHandler'

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
			console.log(env.state.polygon)
			env.hideMarker()
		}

		drawingManager.setDrawingMode(null)
		const polygon = e.overlay
		polygon.setEditable(true)

		env.setState({polygon})

		searchWithinPolygon(env)

		polygon.getPath().addListener('set_at', () => searchWithinPolygon(env))
		polygon.getPath().addListener('insert_at', () => searchWithinPolygon(env))
	})

	return drawingManager
}

export const searchWithinPolygon = (env) => {
	dictionaryToArray(env.state.markers).forEach(marker => {
		if(env.google.maps.geometry.poly.containsLocation(marker.position, env.state.polygon)) {
			marker.setMap(env.map)
		} else {
			marker.setMap(null)
		}
	})
}

export function toggleDrawing (manager) {
	if(manager.map) {
		manager.setMap(null)
		if(this.state.polygon) this.state.polygon.setMap(null)
	} else {
		manager.setMap(this.map)
	}
}

/*******************************************************************************/
