import React, { Component } from 'react';
import { MapConsumer } from '../../MapContainer'

class Distance extends Component {

	componentDidUpdate(prevProps, prevState) {
		const { google, map, state, updateState } = this.props.context
		const { selected } = state
		console.log('elo')
		if(prevProps.context.google !== google) {
			console.log(selected)
			this.distanceMatrixService = new google.maps.DistanceMatrixService()
			const elo = this.getDistance({
				origins: [selected[0].getPosition()],
				destinations: [selected[1].getPosition()],
			})
			console.log(elo)
		}
	}

	getDistance = (config = {}) => {
		const { google } = this.props.context
		const {
			origins = ['Washington,DC'],
			destinations = ['New+York+City,NY'],
			travelMode = 'BICYCLING',
			unitSystem = 'IMPERIAL',
			avoid = 'highways',
		} = config

		this.distanceMatrixService.getDistanceMatrix({
			origins,
			destinations,
			travelMode: google.maps.TravelMode[travelMode],
			unitSystem: google.maps.UnitSystem[unitSystem],
		}, (data, status) => {
			console.log(status)
			if(status !== google.maps.DistanceMatrixStatus.OK) return
			const { distance, duration } = data.rows[0].elements[0]
			return {
				text: distance.text,
				duration: duration.text
			}
		})
	}


	render = () => this.props.children || null
}

export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <Distance {...props} context={context} ref={ref} />}
	</MapConsumer>
));
