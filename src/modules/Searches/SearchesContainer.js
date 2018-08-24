import React, { Component } from 'react';
import Searches from './Searches'

import { MapConsumer } from '../Map/MapContainer'

class SearchesContainer extends Component {

	handleToggle = (e) => {
		const { checked, id, dataset, name } = e.target
		const { toggleMarkers } = this.props.context

		switch (name) {
			case 'term':
				toggleMarkers({term: id}, checked)
				break
			case 'marker':
				toggleMarkers({term: dataset.term, name: id}, checked)
				break
		}
	}

	render() {
		const { markers } = this.props.context

		return(
			<Searches toggleMarkers={this.handleToggle}
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
