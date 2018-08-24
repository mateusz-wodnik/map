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
		const { map } = this.props.context
		const { active } = this.props.data
		if(prevProps.data.active !== active) {
			active ? this.marker.setMap(map) : this.marker.setMap(null)
		}
	}

	render = () => null

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
			updateState({infoWindowMarker: marker})
		})
		return marker
	}
}

export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <Marker {...props} context={context} ref={ref} />}
	</MapConsumer>
));
