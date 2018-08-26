import React from 'react'
import './DisplayDistance.css'

const DisplayDistance = ({origin, addresses, destinations}) => (
	<div>
		<h1 className="origin,">Your location: {origin}</h1>
		<div className="distances">
			{addresses.map((address, idx) => {
				return (
					<div key={address+idx} className="distances__address">
						<h5>{address}</h5>
						<time>{destinations[idx].duration.text}</time>
					</div>
				)
			})}
		</div>
	</div>
)

export default DisplayDistance
