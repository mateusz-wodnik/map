import React from 'react';
import SearchesContainer from '../Searches/SearchesContainer'
import SearchContainer from '../Search/SearchContainer'
import Distance from '../Map/components/Distance/Distance'
import DisplayDistance from '../Map/components/Distance/DisplayDistance'

const Sidebar = () => {
	return(
		<aside className="map__sidebar">
			<SearchContainer />
			<Distance>
				<DisplayDistance />
			</Distance>
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


export default Sidebar
