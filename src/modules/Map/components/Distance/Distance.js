import React, { Component, Children, cloneElement } from 'react';
import { MapConsumer } from '../../MapContainer'
import { getDistance } from '../../_utils/distance'
import { getCurrentPosition } from '../../_utils/geolocation'
import Loader from '../../../../components/Loader/Loader'

class Distance extends Component {
	state = {
		origin: 'select',
		addresses: [],
		destinations: [],
		error: false,
		loading: true
	}

	componentDidUpdate(prevProps) {
		const { selected } = this.props.context.state
		if(prevProps.context.google !== this.props.context.google) {
			getCurrentPosition()
				.then(position => {
					const geocoder = new this.props.context.google.maps.Geocoder()
					return new Promise((resolve, reject) => {
						geocoder.geocode({'location': position}, (res, status) => {
							if(status !== 'OK') reject('Geocoder failed')
							if(!res[0]) reject('No result found')
							resolve(res[0].formatted_address)
						})
					})
				})
				.then(origin => this.setState({ origin, error: false, loading: false }))
				.catch(err => {
					this.setState({
						error: err,
						loading: false
					})
				})
		}

		if(prevProps.context.state.selected !== selected && selected.length > 1) {
			getCurrentPosition()
				.then(position => {
					const destinations = selected.map(marker => {
						return {
							lat: marker.getPosition().lat(),
							lng: marker.getPosition().lng()
						}
					})
					return getDistance({
						origins: [position],
						destinations,
					})
				})
				.then(data => {
					this.setState({
						origin: data.originAddresses[0],
						addresses: data.destinationAddresses,
						destinations: data.rows[0].elements
					})
				})
				.catch(err => alert("Couldn't get location"))
		}
	}

	render = () => {
		if(this.state.loading) return <Loader/>
		// Passing new props from Distance component to children
		return Children.map(this.props.children, child => cloneElement(child, {...this.state}))
	}
}

export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <Distance {...props} context={context} ref={ref} />}
	</MapConsumer>
));
