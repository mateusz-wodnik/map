import React from 'react';
import { MapConsumer } from '../Map/MapContainer'
import SearchesContainer from '../Searches/SearchesContainer'


const Sidebar = ({context}) => {
	const { state, handleSearch, toggleDrawing, drawingManager } = context
	const { distance } = state
	return(
		<aside className="map__sidebar">
			<button onClick={() => console.log(state)}>state</button>
			<button onClick={() => toggleDrawing(drawingManager)}>draw</button>
			<form onSubmit={e => {
				e.preventDefault()
				handleSearch(e.target.search.value)
			}}>
				<input type="text" name="search" id="search" placeholder="search"/>
				<button type="submit">search</button>
			</form>
			<button onClick={this.handleDistance}>get distance</button>
			<div>
				{distance ?
					<div>
						<p>{distance.text}</p>
						<p>{distance.duration}</p>
					</div>
					: 'select points'}
			</div>

			<SearchesContainer />
		</aside>
	)
}


export default React.forwardRef((props, ref) => (
	<MapConsumer>
		{context => <Sidebar {...props} context={context} ref={ref} />}
	</MapConsumer>
));
