import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server'
import { MapConsumer } from '../../MapContainer'
import { streetView } from '../../_utils/marker'
import ReactDOM from 'react-dom'
import StreetView from '../StreetView/StreetView'

class Marker extends Component {

	componentDidMount() {
		const { data, showStreetView } = this.props

		this.marker = this.newMarker(data, showStreetView)
	}

	componentDidUpdate(prevProps, prevState) {
		const { google, map } = this.props.context
		const { active, animation } = this.props.data

		// "active" parameter handles visibility of marker.
		if(prevProps.data.active !== active) {
			active ? this.marker.setMap(map) : this.marker.setMap(null)
		}
			console.log(prevProps.data.animation, animation)
		if(prevProps.data.animation !== animation) {
			this.marker.setAnimation(google.maps.Animation[animation])
		}
	}

	render = () => null

	newMarker = (data) => {
		const { google, map, updateState, selected } = this.props.context
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
			const update = { infoWindowMarker: marker }

			if(selected.some(marker => marker.name === this.marker.name)) {
				update.selected = selected.filter(marker => marker.name !== this.marker.name)
				updateMarkers({name, term}, {animation: null})

			} else {
				console.log(name, term)
				update.selected = [...selected, this.marker]
				updateMarkers({name, term}, { animation: 'BOUNCE' })
			}
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
