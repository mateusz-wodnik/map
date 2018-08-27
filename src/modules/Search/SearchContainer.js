import React, { Component } from 'react';
import { MapConsumer } from '../Map/MapContainer'
import Search from './Search'

class SearchContainer extends Component {
	state = {
		loading: false,
		error: false
	}

	handleSearch = (e) => {
		e.preventDefault()
		this.setState({loading: true, error: false})
		const term = e.target.term.value.toString().trim()
		e.target.term.value = ''
		this.props.context.searchYelpTerm(term)
			.then(res => {
				if (res.error) throw res.error
				this.setState({loading: false, error: false})
			})
			.catch(err => {
				this.setState({loading: false, error: err})
			})
	}

	render = () => <Search loading={this.state.loading}
												 error={this.state.error}
												 handleSearch={this.handleSearch}
	/>
}

export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <SearchContainer {...props} context={context} ref={ref} />}
	</MapConsumer>
));
