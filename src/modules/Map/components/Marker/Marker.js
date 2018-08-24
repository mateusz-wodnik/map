import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server'
import { MapConsumer } from '../../MapContainer'
import { streetView } from '../../_utils/marker'
import ReactDOM from 'react-dom'
import StreetView from '../StreetView/StreetView'

class Marker extends Component {
	map = this.props.context.map
	google = this.props.context.google
	infoWindow = this.props.context.infoWindow
	updateState = this.props.context.updateState

	componentDidMount() {
		const { data, showStreetView } = this.props
		this.marker = this.newMarker(data, showStreetView)
		this.marker.setMap(this.map)
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.props.data.active !== prevProps.data.active) {
			const { active } = this.props.data
			active ? this.marker.setMap(this.map) : this.marker.setMap(null)
		}
	}

	render = () => null

	newMarker = (data, showStreetView) => {
		const { position, name, map=null, ...prop } = data

		const marker = new this.google.maps.Marker({
			map,
			position,
			name,
			title: name,
			...prop,
			animation: this.google.maps.Animation.DROP,
		})

		marker.addListener('click', () => {
			console.log('markerclick')
			this.updateState({infoWindowMarker: marker})
			// handleSelectMarker.bind(this)(marker)
			// Add street view in info window
			// if(showStreetView) {
			// 	streetView(marker, this)
			// } else {
				// const content = ReactDOMServer.renderToString(this.props.children)
				// this.infoWindow.setContent(content)
			// }
			// this.infoWindow.open(this.map, marker)
			// console.log(this.props.context)
			// ReactDOM.render(<StreetView position={position} pro={this.props.context}/>, document.getElementById('panorama'))
		})
		// marker.addListener('oncloseclick', () => {
		// 	this.updateState({infoWindowMarker: marker})
		// })
		return marker
	}
}

export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <Marker {...props} context={context} ref={ref} />}
	</MapConsumer>
));



function handleSelectMarker(marker) {
	const item = this.state.selected.find(item => item.title === marker.title)
	if(item) {
		item.setIcon('https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png')
		this.setState({selected: this.state.selected.filter(item => item.title !== marker.title)})
		return
	}
	marker.setIcon('http://maps.google.com/mapfiles/kml/paddle/orange-circle.png')
	this.setState({selected: [...this.state.selected, marker]})
}
