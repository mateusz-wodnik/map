import React, { Component } from 'react'
import { MapConsumer } from '../../MapContainer'

class StreetView extends Component {
	componentDidMount() {
		const { google } = this.props.context
		if(google) {
			this.streetViewService = new google.maps.StreetViewService
			this.radius = 50

			const { position } = this.props
			this.streetViewService.getPanoramaByLocation(position, this.radius, this.getStreetView)
		}
	}

	render = () => <div style={{width: "300px", height: "300px"}} id="panorama">lodaing...</div>

	getStreetView = (data, status) => {
		const { position, context } = this.props
		const { google } = context

		if(status === google.maps.StreetViewStatus.OK) {
			const nearStreetViewLocation = data.location.latLng;
			const heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, position)
			const panoramaOptions = {
				position: nearStreetViewLocation,
				pov: {
					heading,
					pitch: 30,
				}
			}
			return new google.maps.StreetViewPanorama(document.querySelector('#panorama'), panoramaOptions)
		} else {
			console.error('eroorororororooro street view')
		}
	}

}


export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <StreetView {...props} context={context} ref={ref} />}
	</MapConsumer>
));
