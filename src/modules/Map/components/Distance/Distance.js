import React, { Component, Children, cloneElement } from 'react';
import { MapConsumer } from '../../MapContainer'
import { getDistance } from '../../_utils/distance'

class Distance extends Component {
	state = {
		distance: {},
		duration: {}
	}

	componentDidUpdate(prevProps) {
		const { selected } = this.props.context.state
		if(prevProps.context.state.selected !== selected && selected.length > 1) {
			const lastIndex = selected.length - 1
			getDistance({
				origins: [{
					lat: selected[lastIndex - 1].getPosition().lat(),
					lng: selected[lastIndex - 1].getPosition().lng(),
				}],
				destinations: [{
					lat: selected[lastIndex].getPosition().lat(),
					lng: selected[lastIndex].getPosition().lng(),
				}],
			})
				.then(data => {
					const { distance, duration } = data.rows[0].elements[0]
					console.log(distance, duration)
					this.setState({distance: {distance, duration}})
				})
				.catch(console.error)
		}
	}

	render = () => {
		return Children.map(this.props.children, child => cloneElement(child, {...this.state}))
	}
}

export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <Distance {...props} context={context} ref={ref} />}
	</MapConsumer>
));
