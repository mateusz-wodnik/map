import React, { Component } from 'react';
import Map from './Map';
import { yelp } from '../../env/variables'
import mapStyles from './styles/assasinsCreed'
import './MapContainer.css'
import Searches from './Searches'

import googleMapInit from './_utils/googleMapsInitializer'
import { newMarker, showMarker, hideMarker } from './_utils/marker'
import { getDistance } from './_utils/map'

class MapContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			map: {},
			google: '',
			markers: [],
			polygon: null,
			selected: []
		}
		googleMapInit.bind(this)({styles: mapStyles})
	}

	yelpRequest = (query, term = '') => {
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
						term,
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
			lng: -0.1269
		}
		term = term.toString().trim()
		this.yelpRequest(`term=${term}&latitude=${position.lat}&longitude=${position.lng}&limit=25`, term)
			.then(res => {
				let destinations = []
				const markers = res.markers.map(marker => {
					marker.setMap(this.map)
					destinations.push({
						lat: marker.position.lat(),
						lng: marker.position.lng(),
					})
					return marker
				})
				this.setState({markers: {
						...this.state.markers,
						[term]: markers
					}}, () => {
					this.getDistance({
						origins: [{ lat: 51.5074, lng: -0.1269 }],
						destinations
					}, (data) => {
						const markers = this.state.markers[term].map((marker, idx) => {
							marker.destination = data.rows[0].elements[idx]
							return marker
						})
						this.setState({
							markers: {
								...this.state.markers,
								[term]: markers
							}})
					})
				})
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
					<Searches markers={this.state.markers}/>
				</aside>
				<Map />
			</section>
		)
	}
}

export default MapContainer
