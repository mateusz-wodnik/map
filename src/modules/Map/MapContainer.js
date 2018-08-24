import React, { Component, createContext } from 'react';
import Map from './Map';
import mapStyles from './styles/assasinsCreed'
import './MapContainer.css'
import SearchesContainer from './components/Searches/SearchesContainer'
import Marker from './components/Marker/Marker'
import googleMapInit from './_utils/googleMapsInitializer'
import { newMarker, showMarker, hideMarker } from './_utils/marker'
import { getDistance } from './_utils/map'
import { yelpTermRequest } from './_utils/yelpApiCaller'
import { dictionaryToArray, arrayToDictionary } from './_utils/dictionaryHandler'
import InfoWindow from './components/Marker/elements/InfoWindow'
import StreetView from './components/StreetView/StreetView'

const MapContext = createContext('elo')
export const MapProvider = MapContext.Provider
export const MapConsumer = MapContext.Consumer

class MapContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			markers: {},
			polygon: null,
			selected: [],
			infoWindowMarker: {},
		}
		googleMapInit.bind(this)({styles: mapStyles})
	}

	handleSearch = (input) => {
		const position = {
			lat: 51.5074,
			lng: -0.1269
		}
		const term = input.toString().trim()
		yelpTermRequest(term, position)
			.then(res => {
				console.log(res)
				const markers = res.businesses.map(business => {
					const { coordinates, name, phone } = business
					const { latitude, longitude } = coordinates
					const marker = {
						position: {lat: latitude, lng: longitude},
						name,
						term,
						phone,
						active: true
					}
					return marker
				})
				this.setState({
					markers: {
						...this.state.markers,
						[term]: markers
					}
				})
			})
			.catch(console.error)
	}



	updateState = (update) => {
		this.setState(update)
	}

	handleInfo = (e) => {
		console.log(e)
	}

	handleDistance = () => {
		if(this.state.selected.length < 2) return alert('You have to select at least two point on the map')
		const selected = this.state.selected
		this.getDistance({
			origins: [{lat: selected[0].position.lat(), lng: selected[0].position.lng()}],
			destinations: [{lat: selected[1].position.lat(), lng: selected[1].position.lng()}]
		})
	}

	toggleMarkers = (params={}, active=true) => {
		const { marker={}, markers } = params
		const { term, name } = marker
		const stateMarkers = this.state.markers

		if(markers) {
			const arrayState = dictionaryToArray(stateMarkers).map(stateMarker => {
				if(markers.some(marker => marker.name === stateMarker.name)) {
					return {...stateMarker, active}
				}
				return { ...stateMarker, active: !active }
			})
			console.log(arrayToDictionary(arrayState, 'term'))
			return this.setState({
				markers: { ...stateMarkers, ...arrayToDictionary(arrayState, 'term') }
			})
		}

		if(term) {
			this.setState({
				markers: {
					...stateMarkers,
					[term]: stateMarkers[term].map(marker => {
						if(name) {
							if(marker.name === name) return {...marker, active}
							return marker
						}
						return {...marker, active}
					})
				}
			})
		}
	}

	render() {
		const { markers, distance, infoWindowMarker } = this.state
		return (
			<MapProvider value={{
				markers,
				infoWindowMarker,
				google: this.google,
				map: this.map,
				streetViewService: this.streetViewService,
				actions: {
					showMarker: showMarker.bind(this),
					hideMarker: hideMarker.bind(this),
					newMarker: newMarker.bind(this),
				},
				updateState: this.updateState
			}}>
				<section className="map">
					<aside className="map__sidebar">
						<button onClick={() => console.log(this.state)}>state</button>
						<button onClick={() => this.setState({elo: 'siema'})}>state</button>
						<button onClick={() => this.toggleMarkers({markers: [...markers.coffe, ...markers.bowling]})}>show</button>
						<button onClick={() => this.toggleMarkers({markers: [...markers.coffe, ...markers.bowling]}, false)}>hide</button>
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
						{dictionaryToArray(markers).map((marker, idx) =>
							<Marker key={idx + marker.name} data={marker}></Marker>
						)}
						{/*<SearchesContainer updateState={this.updateState}*/}
						{/*showMarker={this.showMarker}*/}
						{/*hideMarker={this.hideMarker}*/}
						{/*/>*/}
					</aside>
					<Map>
						<InfoWindow>
							<p>{this.state.infoWindowMarker.name}</p>
							<StreetView position={this.state.infoWindowMarker.position}/>
						</InfoWindow>
					</Map>
				</section>
			</MapProvider>
		)
	}
}

export default MapContainer

// handleSearch = (term) => {
// 	// handling recived markers
// 	const position = {
// 		lat: 51.5074,
// 		lng: -0.1269
// 	}
// 	term = term.toString().trim()
// 	yelpRequest.bind(this)(`term=${term}&latitude=${position.lat}&longitude=${position.lng}&limit=25`, term)
// 		.then(res => {
// 			let destinations = []
// 			const markers = res.markers.map(marker => {
// 				marker.setMap(this.map)
// 				destinations.push({
// 					lat: marker.position.lat(),
// 					lng: marker.position.lng(),
// 				})
// 				return marker
// 			})
// 			this.setState({markers: {
// 					...this.state.markers,
// 					[term]: markers
// 				}}, () => {
// 				this.getDistance({
// 					origins: [{ lat: 51.5074, lng: -0.1269 }],
// 					destinations
// 				}, (data) => {
// 					const markers = this.state.markers[term].map((marker, idx) => {
// 						marker.destination = data.rows[0].elements[idx]
// 						return marker
// 					})
// 					this.setState({
// 						markers: {
// 							...this.state.markers,
// 							[term]: markers
// 						}})
// 				})
// 			})
// 		})
// 		.catch(console.error)
// }
