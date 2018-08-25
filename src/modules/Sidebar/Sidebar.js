import React from 'react';
import { MapConsumer } from '../Map/MapContainer'
import SearchesContainer from '../Searches/SearchesContainer'
import SearchContainer from '../Search/SearchContainer'
import Distance from '../Map/components/Distance/Distance'

const Sidebar = ({context}) => {
	const { state } = context
	return(
		<aside className="map__sidebar">
			<SearchContainer />
			{/*<Distance>*/}
				{/*<DisplayDistance />*/}
			{/*</Distance>*/}
			<SearchesContainer filters={{
				best: (a, b) => a.rating < b.rating,
				closest: (a, b) => a.distance < b.distance,
				cheapest: (a, b) => {
					const aPrice = a.price || []
					const bPrice = b.price || []
					return aPrice.length > bPrice.length
				},
			}} />
		</aside>
	)
}


export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <Sidebar {...props} context={context} ref={ref} />}
	</MapConsumer>
));

const DisplayDistance = ({distance}) => (
	<div>
		<h1>distance:</h1>
		{console.log(distance)}
		<p>{distance.text}</p>
		<p>{distance.text}</p>
	</div>
)
