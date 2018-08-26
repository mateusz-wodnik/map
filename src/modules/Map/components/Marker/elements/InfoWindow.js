import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { MapConsumer } from '../../../MapContainer'

class InfoWindow extends Component {

	componentDidUpdate(prevProps) {
		const { google, map, state, updateState } = this.props.context
		const { infoWindowMarker } = state
		// Create new infoWindow instance when Google Maps API is available
		if(prevProps.context.google !== google) {
			this.infoWindow = new google.maps.InfoWindow()
			this.infoWindow.addListener('closeclick', () => {
				this.infoWindow.close()
				updateState({infoWindowMarker: {}})
			})
		}

		if(prevProps.context.infoWindowMarker !== infoWindowMarker && infoWindowMarker.position) {
			this.infoWindow.setContent(`<div id="infoWindow"></div>`)
			this.infoWindow.open(map, infoWindowMarker)
			// Forcing update because #infoWindow is available after opening infoWindow and infoWindow.open() event not triggering re-render component
			this.forceUpdate()
		}
	}

	render() {
		const target = document.querySelector('#infoWindow')
		return target ? ReactDOM.createPortal(this.props.children, target) : null
	}
}

export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <InfoWindow {...props} context={context} ref={ref} />}
	</MapConsumer>
));
