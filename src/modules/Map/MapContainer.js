import React, { Component, createContext } from 'react';

import mapStyles from './styles/assasinsCreed'
import './MapContainer.css'

import googleMapInit from './_utils/googleMapsInitializer'

import Map from './Map';
import Sidebar from '../Sidebar/Sidebar'

import Marker from './components/Marker/Marker'
import InfoWindow from './components/Marker/elements/InfoWindow'
import StreetView from './components/StreetView/StreetView'

import { dictionaryToArray, arrayToDictionary } from './_utils/dictionaryHandler'
import { yelpTermRequest } from './_utils/yelpApiCaller'
import { getCurrentPosition } from './_utils/geolocation'

// Creating context for Map container component
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
		const term = input.toString().trim()

		getCurrentPosition()
			.then(position => yelpTermRequest(term, position))
			.then(res => {
				if(!res.businesses.length) throw 'No places found'
				const bounds = new this.google.maps.LatLngBounds()
				const markers = res.businesses.map(business => {
					const { coordinates, name, phone } = business
					const { latitude, longitude } = coordinates
					const position = { lat: latitude, lng: longitude }
					const marker = {
						position,
						name,
						term,
						phone,
						active: true
					}

					bounds.extend(position)
					return marker
				})
				this.setState({
					markers: {
						...this.state.markers,
						[term]: markers
					}
				})
				// First map should pan to center of created bounds and after that fit to this bounds
				this.map.panTo(bounds.getCenter())
				this.google.maps.event.addListenerOnce(this.map, 'idle', () => {
					this.map.fitBounds(bounds)
				})
			})
			.catch(console.error)
			.catch(console.error)
	}



	updateState = (update) => {
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

	toggleMarkers = (params={}, active=true) => {
		const { markers, term, name } = params
		const stateMarkers = this.state.markers

		if(markers) {
			const arrayState = dictionaryToArray(stateMarkers).map(stateMarker => {
				if(markers.some(marker => marker.name === stateMarker.name)) {
					return {...stateMarker, active}
				}
				return { ...stateMarker, active: !active }
			})
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
		const { markers, distance, infoWindowMarker, selected } = this.state
		return (
			<MapProvider value={{
				google: this.google,
				map: this.map,
				markers,
				handleSearch: this.handleSearch,
				toggleDrawing: this.toggleDrawing,
				drawingManager: this.drawingManager,
				infoWindowMarker,
				toggleMarkers: this.toggleMarkers,
				state: this.state,
				selected: selected,
				updateState: this.updateState,
			}}>
				<section className="map-container">
					<Sidebar handleSearch={this.handleSearch} distance={distance}/>
					<Map>
						{dictionaryToArray(markers).map((marker, idx) =>
							<Marker key={idx + marker.name} data={marker} />
						)}
						<InfoWindow>
							<p>{infoWindowMarker.name}</p>
							<StreetView position={infoWindowMarker.position}/>
						</InfoWindow>
					</Map>
				</section>
			</MapProvider>
		)
	}
}

export default MapContainer
