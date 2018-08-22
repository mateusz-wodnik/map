import React, { Component } from 'react';
import Searches from './Searches'

import { MapConsumer } from '../../MapContainer'

class SearchesContainer extends Component {
	handleToggleCategory = (e) => {
		const target = e.target
		const { checked, id, dataset } = target
		const { actions, updateState } = this.props.context

		const toggle = checked ? actions.showMarker : actions.hideMarker
		let markers = {...this.props.context.markers}
		switch (target.name) {
			case 'category':
				const updatedCategory = toggle(markers[id])
				markers = { markers: { ...markers, [id]: updatedCategory } }
				break
			case 'marker':
				const updatedMarker = markers[dataset.category].map(marker => marker.title === id ? toggle([marker])[0] : marker)
				markers = { markers: { ...markers, [dataset.category]: updatedMarker } }
				break
		}
		updateState(markers)
	}

	handleSelect = (e) => {
		if(e.target.checked) {
			this.state.markers[e.target.id].map(marker => marker.setMap(this.map))
		} else {
			this.state.markers[e.target.id].map(marker => marker.setMap(null))
		}
	}

	render() {
		const { markers } = this.props.context
		console.log(markers)
		return(
			<Searches toggleCategory={this.handleToggleCategory}
								markers={markers}
			/>
		)
	}
}

export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <SearchesContainer {...props} context={context} ref={ref} />}
	</MapConsumer>
));
