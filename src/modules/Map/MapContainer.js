import React, { Component, createContext } from 'react';

import mapStyles from './styles/assasinsCreed'
import './MapContainer.css'


import Map from './Map';
import Sidebar from '../Sidebar/Sidebar'

import Marker from './components/Marker/Marker'
import InfoWindow from './components/Marker/elements/InfoWindow'
import StreetView from './components/StreetView/StreetView'

import { dictionaryToArray, arrayToDictionary } from './_utils/dictionaryHandler'
import { getCurrentPosition } from './_utils/geolocation'
import { yelpTermRequest } from './_utils/yelpApiCaller'

// Creating context for Map container component
const MapContext = createContext('elo')
export const MapProvider = MapContext.Provider
export const MapConsumer = MapContext.Consumer

class MapContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			google: {},
			map: {},
			markers: {},
			polygon: null,
			selected: [],
			infoWindowMarker: {},
		}
	}

	componentDidMount() {
		const { libraries, apiKey } = this.props.config
		const script = document.createElement( 'script' );
		script.src = `https://maps.googleapis.com/maps/api/js?libraries=${libraries.toString()}&key=${apiKey}`;
		document.head.appendChild(script)
		script.onload = (e) => {
			this.setState({google: window.google})
		}
	}

	render = () => {
		const { markers, infoWindowMarker, selected, google, map } = this.state
		return (
			<MapProvider value={{
				google,
				map,
				markers,
				infoWindowMarker,
				updateMarkers: this.updateMarkers,
				state: this.state,
				selected: selected,
				updateState: this.updateMapState,
				searchYelpTerm: this.searchYelpTerm,
			}}>
				<section className="map-container">
					<Sidebar handleSearch={this.handleSearch} />
					<Map config={{}}>
						{dictionaryToArray(markers).map((marker, idx) =>
							<Marker key={idx + marker.name} data={marker} />
						)}
						<InfoWindow>
							<header>
								<p>{infoWindowMarker.name}</p>
								<p>{infoWindowMarker.id_closed ? 'closed' : 'opened'}</p>
							</header>
							<StreetView position={infoWindowMarker.position}/>
						</InfoWindow>
					</Map>
				</section>
			</MapProvider>
		)
	}

	updateMapState = (update) => this.setState(update)

	/**
	 * Updating state.markers dictionary helper
	 * @param params {markers: [{name: ''}] || term: '' || term: '' && name: ''} - describing particular marker or array of markers
	 * @param update {} - parameters to update
	 */
	updateMarkers = (params={}, update={active: true}) => {
		const { markers, term, name } = params
		const prevMarkers = this.state.markers

		// Update array of markers
		if(markers) {
			const arrayState = dictionaryToArray(prevMarkers).map(prevMarker => {
				if(markers.some(marker => marker.name === prevMarker.name)) {
					return {...prevMarker, ...update}
				}
				return prevMarker
			})
			return this.setState({
				markers: { ...prevMarkers, ...arrayToDictionary(arrayState, 'term') }
			})
		}

		// Update whole term array or single marker
		if(term) {
			this.setState({
				markers: {
					...prevMarkers,
					[term]: prevMarkers[term].map(marker => {
						if(name) {
							console.log(term, name, update)
							if(marker.name === name) return {...marker, ...update}
							return marker
						}
						return {...marker, ...update}
					})
				}
			})
		}
	}

	searchYelpTerm = (input) => {
		const { markers } = this.state
		const term = input.toString().trim()
		//Function gets current position from HTML5 geolocation API.
		getCurrentPosition()
		// Then calls Yelp API with recived actual position.
			.then(position => yelpTermRequest(term, position, {offset: markers[term] ? markers[term].length : 0}))
			.then(yelp => {
				if(!yelp.businesses.length) throw 'No places found'
				const { google, map, markers, totals } = this.state

				const prevMarkers = markers[term] || []
				const bounds = new google.maps.LatLngBounds()

				const newMarkers = yelp.businesses.map(business => {
					const { latitude, longitude } = business.coordinates
					const position = { lat: latitude, lng: longitude }
					const marker = {
						position,
						...business,
						term,
						// Active parameter handles visibility of marker. Set to true by default.
						active: true,
					}
					bounds.extend(position)
					return marker
				})

				console.log(prevMarkers, newMarkers)
				this.setState({
					// Update main map state with fetched new markers
					markers: {
						...markers,
						[term]: [ ...prevMarkers, ...newMarkers]
					},
					// Remember total number of term search results
					totals: {
						...totals,
						[term]: yelp.total,
					}
				})
				// First map should pan to center of created bounds.
				map.panTo(bounds.getCenter())
				google.maps.event.addListenerOnce(map, 'idle', () => {
					// Then map should fit to bounds.
					map.fitBounds(bounds)
				})
			})
			.catch(console.error)
			.catch(console.error)
	}
}

export default MapContainer
