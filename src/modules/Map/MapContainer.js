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
			markers: {},
			polygon: null,
			selected: []
		}
		googleMapInit.bind(this)({styles: mapStyles})
	}

	yelpRequest = (query) => {
		// return markers and query to decide in handler what to do with them
		return fetch(`${yelp.url}/${query}`)
			.then(res => res.json())
			.then(res => {
				const markers = res.businesses.map(business => {
					const { coordinates, name, phone } = business
					const { latitude, longitude } = coordinates
					const marker = {
						position: {lat: latitude, lng: longitude},
						name,
						phone
					}
					return this.newMarker(marker, false)
				})
				return {query, markers}
			})
			.catch(console.error)
	}

	handleSearch = (term) => {
		// handling recived markers
		const position = {
			lat: 51.5074,
			lng: 0
		}
		this.yelpRequest(`term=${term.toString().trim()}&latitude=${position.lat}&longitude=${position.lng}&limit=10`)
			.then(res => {
				const markers = res.markers.map(marker => {
					marker.setMap(this.map)
					return marker
				})
				this.setState({markers: {...this.state.markers, [res.query]: markers}})
			})
			.catch(console.error)
	}

	handleSelect = (e) => {
		if(e.target.checked) {
			this.state.markers[e.target.id].map(marker => marker.setMap(this.map))
		} else {
			this.state.markers[e.target.id].map(marker => marker.setMap(null))
		}
	}

	handleDistance = () => {
		if(this.state.selected.length < 2) return alert('You have to select at least two point on the map')
		const selected = this.state.selected
		this.getDistance({
			origins: [{lat: selected[0].position.lat(), lng: selected[0].position.lng()}],
			destinations: [{lat: selected[1].position.lat(), lng: selected[1].position.lng()}]
		})
	}

	render() {
		return (
			<section className="map">
				<aside className="map__sidebar">
					<button onClick={() => console.log(this.state)}>state</button>
					<button onClick={() => this.showMarker()}>show</button>
					<button onClick={() => this.hideMarker()}>hide</button>
					<button onClick={() => this.toggleDrawing(this.drawingManager)}>draw</button>
					<form onSubmit={e => {
						e.preventDefault()
						this.handleSearch(e.target.search.value)
					}}>
						<input type="text" name="search" id="search" placeholder="search"/>
						<button type="submit">search</button>
					</form>
					<button onClick={this.handleDistance}>get distance</button>
					<div>
						{this.state.distance ?
							<div>
								<p>{this.state.distance.text}</p>
								<p>{this.state.distance.duration}</p>
							</div>
							: 'select points'}
					</div>
					<div name="markers" id="markers" onChange={this.handleSelect}>
						{Object.keys(this.state.markers).map(name => <div>
							<label htmlFor={name}>{name}</label>
							<input type={"checkbox"} key={name} id={name} defaultChecked={true} />
						</div>)}
					</div>
				</aside>
				<Map />
			</section>
		)
	}
}

export default MapContainer
