import React, { Component } from 'react';
import { getCurrentPosition } from './_utils/geolocation'
import { MapConsumer } from './MapContainer'
import Loader from '../../components/Loader/Loader'

class Map extends Component {
	componentDidUpdate(prevProps) {
		const { google } = this.props.context
		// Create new Google Maps map instance
		if(prevProps.context.google !== google) {
			const {
				center = { lat: 51.5074, lng: -0.1269 },
				zoom = 12,
				styles = {},
			} = this.props.config

			getCurrentPosition()
				.then(center => {
					const { updateState, google } = this.props.context
					const map = new google.maps.Map(document.getElementById('map'), {
						center,
						zoom,
						styles,
					});
					// End loading when tiles is loaded
					map.addListener( 'tilesloaded', () => {
						updateState({ mapLoading: false })
					});
					updateState({ map })
				})
				.catch(err => {
					const { updateState, google } = this.props.context
					const map = new google.maps.Map(document.getElementById('map'), {
						center,
						zoom,
						styles,
					});
					updateState({ map })
				})
		}
	}

	// Rendering a wrapper for new Google Maps map instance
	render = () => {
		if(this.props.context.mapError) {
			return (
				<section className="map-error">
					<h1>Could not load Google Maps.</h1>
					<p>Please check your internet connection and refresh the page.</p>
				</section>
			)
		} else {
			return (
				<section className="map__instance">
					{this.props.context.mapLoading && <Loader mask={true}/>}
					<div id="map" style={{height: "100vh"}}></div>
					{this.props.children}
				</section>
			)
		}
	}
}

export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <Map {...props} context={context} ref={ref} />}
	</MapConsumer>
));
