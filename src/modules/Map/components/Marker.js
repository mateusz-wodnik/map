import React, { Component } from 'react';

class Marker extends Component {
	componentDidMount = () => {
		const { position, map, title } = this.props
		const marker = new window.google.maps.Marker({
			position,
			map,
			title,
		});
		console.log(marker)
		this.setState({markers: [...this.state.markers, marker]})
	}

	render() {
		return(
			<div className="marker"></div>
		)
	}
}
