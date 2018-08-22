import React, { Component, createContext } from 'react';
import Map from './Map';
import { yelp } from '../../env/variables'
import mapStyles from './styles/assasinsCreed'
import './MapContainer.css'
import SearchesContainer from './components/Searches/SearchesContainer'

import googleMapInit from './_utils/googleMapsInitializer'
import { newMarker, showMarker, hideMarker } from './_utils/marker'
import { getDistance } from './_utils/map'
import { yelpRequest } from './actions/SearchesActions'

const MapContext = createContext('elo')
export const MapProvider = MapContext.Provider
export const MapConsumer = MapContext.Consumer

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

	handleSearch = (term) => {
		// handling recived markers
		const position = {
			lat: 51.5074,
			lng: -0.1269
		}
		term = term.toString().trim()
		yelpRequest.bind(this)(`term=${term}&latitude=${position.lat}&longitude=${position.lng}&limit=25`, term)
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

	updateState = (update) => {
		console.log(update: update)
		this.setState(update)
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
		const {
			markers,
			distance
		} = this.state
		return (
			<MapProvider value={{
				markers: markers,
				google: this.google,
				map: this.map,
				actions: {
					showMarker: showMarker.bind(this),
					hideMarker: hideMarker.bind(this),
				},
				updateState: this.updateState
			}}>
				<section className="map">
					<aside className="map__sidebar">
						<button onClick={() => console.log(this.state)}>state</button>
						<button onClick={() => this.showMarker(markers.coffe)}>show</button>
						<button onClick={() => this.hideMarker(markers.coffe)}>hide</button>
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
							{distance ?
								<div>
									<p>{distance.text}</p>
									<p>{distance.duration}</p>
								</div>
								: 'select points'}
						</div>
						<SearchesContainer updateState={this.updateState}
															 showMarker={this.showMarker}
															 hideMarker={this.hideMarker}
						/>
					</aside>
					<Map />
				</section>
			</MapProvider>
		)
	}
}

export default MapContainer
