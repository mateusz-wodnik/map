import React from 'react';

const Map = ({children}) => (
	<section className="map__instance">
		<div id="map" style={{height: "100vh"}}></div>
		{children}
	</section>
)

export default Map
