import React, { Component } from 'react';
import { getCurrentPosition } from '../Map/_utils/geolocation'
import { yelpTermRequest } from '../Map/_utils/yelpApiCaller'
import { MapConsumer } from '../Map/MapContainer'
import Search from './Search'

class SearchContainer extends Component {

	handleSearch = (input) => {
		const term = input.toString().trim()
		this.props.context.searchYelpTerm(term)
	}

	render = () => <Search handleSearch={e => {
		e.preventDefault()
		this.props.context.searchYelpTerm(e.target.term.value)
	}}/>
}

export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <SearchContainer {...props} context={context} ref={ref} />}
	</MapConsumer>
));
