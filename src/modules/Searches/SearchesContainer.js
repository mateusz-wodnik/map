import React, { Component } from 'react';
import Searches from './Searches'

import { MapConsumer } from '../Map/MapContainer';

class SearchesContainer extends Component {

	handleToggle = (e) => {
		const { checked, id, dataset, name } = e.target
		const { updateMarkers } = this.props.context
		const update = {active: checked}

		// Check if event was triggered by single marker checkbox or term checkbox and update main map state
		switch (name) {
			case 'term':
				updateMarkers({term: id}, update)
				break
			case 'marker':
				updateMarkers({term: dataset.term, name: id}, update)
				break
			default:
				return
		}
	}

	handleHover = (name, term, enter) => {
		const { updateMarkers } = this.props.context
		updateMarkers({name, term}, { hovered: enter })
	}

	render() {
		const { markers, state, searchYelpTerm } = this.props.context

		return <Searches updateMarkers={this.handleToggle}
										 handleHover={this.handleHover}
										 totals={state.totals}
										 moreRecords={searchYelpTerm}
										 markers={markers}
										 filters={this.props.filters}
		/>
	}
}

export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <SearchesContainer {...props} context={context} ref={ref} />}
	</MapConsumer>
));
