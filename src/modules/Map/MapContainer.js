import React, { Component, createContext } from 'react';

import './MapContainer.css'

import Map from './Map';
import Sidebar from '../Sidebar/Sidebar'

import Marker from './components/Marker/Marker'
import InfoWindow from './components/Marker/elements/InfoWindow'
import StreetView from './components/StreetView/StreetView'

import { dictionaryToArray, arrayToDictionary } from './_utils/dictionaryHandler'
import { getCurrentPosition } from './_utils/geolocation'
import { yelpTermRequest } from './_utils/yelpApiCaller'
import Welcome from '../Welcome/Welcome'

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
			mapError: false,
			mapLoading: true
		}
	}

	// Loading Google Maps scripts right after mounting map container
	componentDidMount() {
		const { libraries, apiKey } = this.props.config
		this.setState({mapLoading: true})
		const script = document.createElement( 'script' );
		script.src = `https://maps.googleapis.com/maps/api/js?libraries=${libraries.toString()}&key=${apiKey}`;
		document.head.appendChild(script)
		script.onload = (e) => {
			// When script load and is available in window, update state with "google" object
			this.setState({
				google: window.google,
				mapError: false
			})
		}

		script.onerror = (err) => {
			this.setState({
				mapLoading: false,
				mapError: true
			})
			console.error("Couldn't load Google Maps")
		}
	}

	render = () => {
		const { markers, infoWindowMarker, selected, google, map, mapError, mapLoading } = this.state
		return (
			// Creating shared context with state management methods and Google Maps API related variables
			<MapProvider value={{
				google,
				map,
				mapError,
				mapLoading,
				markers,
				infoWindowMarker,
				updateMarkers: this.updateMarkers,
				state: this.state,
				selected: selected,
				updateState: this.updateMapState,
				searchYelpTerm: this.searchYelpTerm,
			}}>
				<section className="map-container">
					<Sidebar mapError={mapError}/>
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
				<Welcome />
			</MapProvider>
		)
	}

	updateMapState = (update) => this.setState(update)

	/**
	 * Updating state.markers dictionary helper. It is able to update arrays of markers, whole terms arrays and single elements.
	 * @param params {markers: [{name: ''}] || term: '' || term: '' && name: ''} - describing particular marker or array of markers
	 * @param update {} - parameters to update
	 */
	updateMarkers = (params={}, update={}) => {
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

		// Update whole term array in state...
		if(term) {
			this.setState({
				markers: {
					...prevMarkers,
					[term]: prevMarkers[term].map(marker => {
						// ... or single marker.
						if(name) {
							if(marker.name === name) {
								return {...marker, ...update}
							}
							return marker
						}
						if(this.state.selected.some(item => item.name === marker.name)) return marker
						return {...marker, ...update}
					})
				}
			})
		}
	}

	/**
	 * This function is managing responses from geolocation and Yelp API. It handles related with those async actions state updates.
	 * @param input - string to search
	 * @return {Promise<any | void>}
	 */
	searchYelpTerm = (input) => {
		const { markers } = this.state
		const term = input.toString().trim()
		//Function gets current position from HTML5 geolocation API.
		return getCurrentPosition()
		// Then calls Yelp API with recived actual position.
			.then(position => yelpTermRequest(term, position, {offset: markers[term] ? markers[term].length : 0}))
			.then(yelp => {
				if(yelp.error) throw yelp
				if(!yelp.businesses.length) throw {error: {description: 'No records, try again'}}
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
				return 'OK'
			})
			.catch(err => err)
	}
}

export default MapContainer
