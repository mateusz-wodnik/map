import React, { Component } from 'react';
import Map from './Map';
import { yelp } from '../../env/variables'
import mapStyles from './styles/assasinsCreed'
import './MapContainer.css'

import googleMapInit from './_utils/googleMapsInitializer'
import { newMarker, showMarker, hideMarker } from './_utils/marker'

class MapContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			map: {},
			google: '',
			markers: [],
			polygon: null
		}
		googleMapInit.bind(this)({styles: mapStyles})
	}

	componentDidMount = () => {
		this.yelpRequest('term=bowling&latitude=40.7413549&longitude=-73.9980244&limit=50')
	}

	yelpRequest = (query) => {
		fetch(`${yelp.url}/${query}`)
			.then(res => res.json())
			.then(res => {
				const markers = res.businesses.map(business => {
					const { coordinates, name, phone } = business
					const { latitude, longitude } = coordinates
					// console.log(latitude,longitude)
					const marker = {
						position: {lat: latitude, lng: longitude},
						name,
						phone
					}
					return this.newMarker(marker)
				})
				this.setState({ markers })
			})
			.catch(console.error)
	}

	render() {
		return (
			<section className="map">
				<aside className="map__sidebar">
					<button onClick={() => this.showMarker()}>show</button>
					<button onClick={() => this.hideMarker()}>hide</button>
					<button onClick={() => this.toggleDrawing(this.drawingManager)}>draw</button>
				</aside>
				<Map />
			</section>
		)
	}
}

export default MapContainer
