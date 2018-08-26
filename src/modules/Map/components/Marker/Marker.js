import React, { Component } from 'react';
import { MapConsumer } from '../../MapContainer'

class Marker extends Component {

	componentDidMount() {
		const { data, showStreetView } = this.props

		this.marker = this.newMarker(data, showStreetView)
	}

	componentDidUpdate(prevProps) {
		const { google, map } = this.props.context
		const { active, animation, selected, hovered } = this.props.data

		// "active" parameter handles visibility of marker.
		if(prevProps.data.active !== active) {
			active ? this.marker.setMap(map) : this.marker.setMap(null)
		}

		// Handles marker selection
		if(prevProps.data.selected !== selected) {
			this.marker.setAnimation(animation ? google.maps.Animation[animation] : null)
		}

		// Handles hover on sidebar item
		if(prevProps.data.hovered !== hovered) {
			const icon = hovered ? {path: google.maps.SymbolPath.CIRCLE, scale: 17} : null
			this.marker.setIcon(icon)
		}
	}

	render = () => null

	/**
	 * This function creates new marker with additional listeners
	 * @param data - marker data
	 * @return {*}
	 */
	newMarker = (data) => {
		const { google, map, updateState } = this.props.context
		const { position, name, ...prop } = data

		const marker = new google.maps.Marker({
			map,
			position,
			name,
			...prop,
			animation: google.maps.Animation.DROP,
		})

		marker.addListener('click', () => {
			const { selected, updateMarkers } = this.props.context
			const { name, term } = this.marker
			const update = { }

			// Catch only markers that are selected
			if(selected.some(marker => marker.name === this.marker.name)) {
				update.infoWindowMarker = {}
				update.selected = selected.filter(marker => marker.name !== this.marker.name)
				// Remove animation and selected property from main map state
				updateMarkers({name, term}, { animation: null, selected: false })
			} else {
				update.infoWindowMarker = marker
				update.selected = [...selected, this.marker]
				// Add animation to newly selected marker
				updateMarkers({name, term}, { animation: 'BOUNCE', selected: true })
			}
			// Update info window and selected markers array in main map state
			updateState(update)
		})
		return marker
	}
}

export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <Marker {...props} context={context} ref={ref} />}
	</MapConsumer>
));
